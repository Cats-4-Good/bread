import { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Platform, Text, TouchableOpacity, Image, FlatList } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import MapCentraliseButton from "@/components/map/MapCentraliseButton";
import { ThemedButton, ThemedText } from "@/components";
import Modal from "react-native-modal";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import axios from "axios";
import { Bakery, BakeryStats, GoogleListing } from "@/types";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import BakeryView from "@/components/bakery/BakeryView";
import MapNearbyNewPostButton from "@/components/map/MapNearbyNewPostButton";

export default function Map() {
  const GOOGLE_API = "AIzaSyBo-YlhvMVibmBKfXKXuDVf--a92s3yGpY";

  const mapRef = useRef(null);

  const [selectedListing, setSelectedListing] = useState<GoogleListing | null>(null);
  const [listings, setListings] = useState<GoogleListing[]>([]);
  const [bakeriesStats, setBakeriesStats] = useState<{
    [id: string]: BakeryStats | undefined;
  }>({});
  const [bakeries, setBakeries] = useState<Bakery[]>([]);
  const [location, setLocation] = useState<Location.LocationObjectCoords>();
  const [initialRegion, setInitialRegion] = useState<Region>();
  const [selectedButton, setSelectedButton] = useState<"map" | "list">("list");
  const [isError, setIsError] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const db = getFirestore();

  const getListings = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
        {
          params: {
            location: `${latitude},${longitude}`,
            radius: 1000, // 1km radius
            type: "bakery",
            key: GOOGLE_API,
          },
        }
      );
      const listings: GoogleListing[] =
        response.data.results.map((listing: any) => ({
          // LOL imagine me choosing to use typescript but still being lazy xD
          status: listing.business_status,
          lat: listing.geometry.location.lat,
          lng: listing.geometry.location.lng,
          name: listing.name,
          place_id: listing.place_id,
          rating: listing.rating,
          user_ratings_total: listing.user_ratings_total,
          vicinity: listing.vicinity,
          htmlAttributions: listing.photos
            ? listing.photos.map((obj: any) => obj.html_attributrions)
            : [],
          photoReferences: listing.photos
            ? listing.photos.map((obj: any) => obj.photo_reference)
            : [],
          image: undefined,
        })) ?? [];

      // apparently need to include html attributions in image, but dc for now
      await Promise.all(
        listings.map(async (listing) => {
          listing.image = await getGooglePicture(listing);
          listing.distance = haversineDistance(latitude, longitude, listing.lat, listing.lng);
        })
      );
      listings.sort((a, b) => a.distance - b.distance);
      setListings(listings);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = R * c; // in kilometers

    distance = distance * 1000;
    distance = Math.round(distance / 100) * 100;
    return distance;
  }

  function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  //* Convert blob to base64 for image
  const blobToData = (blob: Blob): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = () => reject("fml");
      reader.readAsDataURL(blob);
    });
  };

  const getGooglePicture = async (listing: GoogleListing) => {
    if (listing.photoReferences.length === 0) return undefined;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${listing.photoReferences[0]}&key=${GOOGLE_API}`
    );
    const blob = await response.blob();
    return (await blobToData(blob)) as string;
  };

  const getBakeryStats = async (bakeryId: string): Promise<BakeryStats | undefined> => {
    const docRef = doc(db, "bakeries", bakeryId);
    return getDoc(docRef)
      .then(async (res) => {
        if (!res.exists()) {
          const defaultBakery: BakeryStats = {
            livePostsCount: 0,
            totalPosts: 0,
          };
          try {
            await setDoc(docRef, defaultBakery);
            return await getBakeryStats(bakeryId);
          } catch (err) {
            console.error("failed to set default bakery", err);
          }
        }
        return res.data() as BakeryStats;
      })
      .catch((err) => {
        console.error("failed to get bakery", err);
        return undefined;
      });
  };

  const getBakeriesStats = async () => {
    const idsToFetch = listings
      .filter((listing) => !(listing.place_id in bakeriesStats))
      .map((listing) => listing.place_id);
    const bakeriesStatsArray = await Promise.all(idsToFetch.map((newId) => getBakeryStats(newId))); // this is to prevent repeated calls on same bakeries when moving map around
    const newBakeriesStats = Object.fromEntries(
      idsToFetch.map((k, i) => [k, bakeriesStatsArray[i]])
    );
    setBakeriesStats({
      ...bakeriesStats,
      ...newBakeriesStats,
    });
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return setIsError(true);
      let loc = await Location.getCurrentPositionAsync({
        accuracy:
          Platform.OS == "android"
            ? Location.LocationAccuracy.Low
            : Location.LocationAccuracy.Lowest,
      });
      setLocation(loc.coords);
      setInitialRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      // Get bakeries
      await getListings(loc.coords.latitude, loc.coords.longitude);
      await getBakeriesStats();
      const finalBakeries = listings.map((listing) => {
        const id = listing.place_id;
        const stats = bakeriesStats[id];
        const bakery: Bakery = { id, listing, stats };
        return bakery;
      });
      setBakeries(finalBakeries);
    })();
  }, []);

  const handleRegionChangeComplete = (region: Region) => {
    // run after 500ms to prevent excessive api calls
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(
      async () => getListings(region.latitude, region.longitude),
      500
    );
  };

  if (isError) {
    return (
      <View style={styles.container}>
        <ThemedText type="default">Permission to access location was denied</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            selectedButton === "list" ? styles.buttonSelected : styles.buttonUnselected,
          ]}
          onPress={() => setSelectedButton("list")}
        >
          <Text style={[styles.buttonText, selectedButton === "list" && styles.buttonTextSelected]}>
            List
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            selectedButton === "map" ? styles.buttonSelected : styles.buttonUnselected,
          ]}
          onPress={() => setSelectedButton("map")}
        >
          <Text style={[styles.buttonText, selectedButton === "map" && styles.buttonTextSelected]}>
            Map
          </Text>
        </TouchableOpacity>
      </View>
      {selectedButton === "map" && (
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={initialRegion}
            showsUserLocation={true}
            onRegionChangeComplete={handleRegionChangeComplete}
            userInterfaceStyle="dark"
          >
            {listings.length > 0 &&
              listings.map((marker) => (
                <Marker
                  coordinate={{
                    latitude: marker.lat,
                    longitude: marker.lng,
                  }}
                  key={marker.place_id}
                  tracksViewChanges={false}
                  image={require("@/assets/images/map-icon-light.png")}
                  onPress={() => setSelectedListing(marker)}
                />
              ))}
          </MapView>
          {location && (
            <MapCentraliseButton mapRef={mapRef} location={location} getMarkers={getListings} />
          )}
        </View>
      )}
      {selectedButton === "list" && (
        <View style={styles.listContainer}>
          <FlatList
            data={listings}
            renderItem={({ item }) => <BakeryView item={item} />}
            keyExtractor={(_, index) => index.toString()}
          />
        </View>
      )}

      <MapNearbyNewPostButton listings={listings.slice(0, 5)} />

      <Modal
        isVisible={!!selectedListing}
        onBackdropPress={() => setSelectedListing(null)}
        hasBackdrop
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{selectedListing?.name}</Text>
          <Text style={styles.modalText}>{selectedListing?.vicinity}</Text>
          <ThemedButton
            type="primary"
            style={{ paddingVertical: 16 }}
            onPress={() => {
              setSelectedListing(null);
              router.push({
                pathname: `/${selectedListing?.name}`,
                params: { ...selectedListing },
              });
            }}
          >
            View bakery posts
          </ThemedButton>
          <Text style={{ fontWeight: "300", alignSelf: "center" }}>
            {3} live posts, {50} archived posts
          </Text>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  topContainer: {
    flex: 1,
    flexDirection: "row",
  },
  mapContainer: {
    flex: 12,
  },
  listContainer: {
    flex: 12,
    marginHorizontal: 20,
    width: "auto",
    marginTop: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonSelected: {
    backgroundColor: Colors.accent,
  },
  buttonUnselected: {
    backgroundColor: Colors.white,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonTextSelected: {
    color: Colors.white,
  },
  buttonTextUnSelected: {
    color: Colors.black,
  },
  modalView: {
    marginVertical: "auto",
    marginHorizontal: "auto",
    width: 340,
    gap: 14,
    backgroundColor: "white",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 25,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalText: {
    fontSize: 16,
  },
});
