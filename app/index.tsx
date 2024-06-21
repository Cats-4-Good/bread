import { useState, useEffect, useRef, useCallback } from "react";
import { StyleSheet, View, Platform, Text, TouchableOpacity, FlatList } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import MapCentraliseButton from "@/components/map/MapCentraliseButton";
import { ThemedButton, ThemedText } from "@/components";
import Modal from "react-native-modal";
import { router, useFocusEffect } from "expo-router";
import { Colors } from "@/constants/Colors";
import axios from "axios";
import { Bakery, BakeryStats, GoogleListing } from "@/types";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import BakeryView from "@/components/bakery/BakeryView";
import MapNearbyNewPostButton from "@/components/map/MapNearbyNewPostButton";
import Constants from "expo-constants";
import LiveLocationText from "@/components/map/LiveLocationText";
import MapShowListButton from "@/components/map/MapShowListButton";
import BlinkingDot from "@/components/map/BlinkingDot";
import { useUser } from "@/hooks";

export default function Map() {
  // OLD
  const GOOGLE_API = "AIzaSyBo-YlhvMVibmBKfXKXuDVf--a92s3yGpY";

  // NEW
  // const GOOGLE_API = "AIzaSyCVJO8VtUL7eZ9dsvB_mHl8q_aPzPR1v5g";

  const mapRef = useRef(null);
  const [selectedBakery, setSelectedBakery] = useState<Bakery | null>(null);
  const [bakeries, setBakeries] = useState<Bakery[]>([]);
  const [location, setLocation] = useState<Location.LocationObjectCoords>();
  const [latestRegion, setLatestRegion] = useState<Region>();
  const [initialRegion, setInitialRegion] = useState<Region>();
  const [selectedButton, setSelectedButton] = useState<"map" | "list">("list");
  const [isError, setIsError] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const db = getFirestore();

  const getListings = async (latitude: number, longitude: number): Promise<Bakery[]> => {
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
          status: listing.business_status,
          lat: listing.geometry.location.lat,
          lng: listing.geometry.location.lng,
          name: listing.name.replace("/", " or "),
          place_id: listing.place_id,
          rating: listing.rating,
          user_ratings_total: listing.user_ratings_total,
          vicinity: listing.vicinity,
          htmlAttributions: listing.photos
            ? listing.photos.map((obj: any) => obj.html_attributrions)
            : [],
          photoReference: listing.photos
            ? listing.photos.map((obj: any) => obj.photo_reference)[0]
            : undefined,
        })) ?? [];

      await Promise.all(
        listings.map(async (listing) => {
          listing.distance = haversineDistance(latitude, longitude, listing.lat, listing.lng);
        })
      );

      const bakeries = await getBakeriesWithStats(listings);
      bakeries.sort((a, b) => a.listing.distance - b.listing.distance);

      return bakeries;
    } catch (error) {
      console.error("Error fetching data [1]:", error);
      return [];
    }
  };

  const getBakeriesWithStats = async (listings: GoogleListing[]): Promise<Bakery[]> => {
    const bakeries = await Promise.all(
      listings.map(async (listing) => {
        const stats = await getBakeryStats(listing.place_id);
        const bakery: Bakery = { id: listing.place_id, listing, stats };
        return bakery;
      })
    );
    return bakeries;
  };

  const getBakeryStats = async (bakeryId: string): Promise<BakeryStats | undefined> => {
    const docRef = doc(db, "bakeries", bakeryId);
    try {
      const res = await getDoc(docRef);
      if (!res.exists()) {
        const defaultBakery: BakeryStats = {
          livePostsCount: 0,
          totalPosts: 0,
        };
        await setDoc(docRef, defaultBakery);
        return defaultBakery;
      }
      return res.data() as BakeryStats;
    } catch (err) {
      console.error("Failed to get bakery stats", err);
      return undefined;
    }
  };

  const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
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
    distance = Math.round(distance / 100) * 100; // Round to nearest 100 meters
    return distance;
  };

  const toRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };

  const loadInitialData = async () => {
    // let { status } = await Location.requestForegroundPermissionsAsync();
    // if (status !== "granted") return setIsError(true);
    // let loc = await Location.getCurrentPositionAsync({
    //   accuracy:
    //     Platform.OS == "android" ? Location.LocationAccuracy.Low : Location.LocationAccuracy.Lowest,
    // });
    // console.log(loc.coords);

    const dummy = {
      accuracy: 30.109974175518165,
      altitude: 39.508697509765625,
      altitudeAccuracy: 15.353239059448242,
      heading: -1,
      latitude: 1.2951306,
      longitude: 103.8488897,
      speed: -1,
    };

    setLocation(dummy);

    const region = {
      latitude: dummy.latitude,
      longitude: dummy.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };
    setInitialRegion(region);
    setLatestRegion(region);

    // Get bakeries
    const bakeries = (await getListings(dummy.latitude, dummy.longitude)) ?? [];
    setBakeries(bakeries);
  };

  const reloadData = async () => {
    if (latestRegion) {
      try {
        const bakeries = await getListings(latestRegion.latitude, latestRegion.longitude);
        setBakeries(bakeries);
      } catch (error) {
        console.error("Error fetching data [2]:", error);
      }
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      reloadData();
    }, [latestRegion])
  );

  const handleRegionChangeComplete = (region: Region) => {
    // run after 1000ms to prevent excessive api calls
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setLatestRegion(region);
    }, 1000);
  };

  if (isError) {
    return (
      <View style={styles.container}>
        <ThemedText type="default">Permission to access location was denied</ThemedText>
      </View>
    );
  }

  const markers =
    bakeries.length > 0 &&
    bakeries.map((bakery) => {
      const marker = bakery.listing;
      return (
        <Marker
          coordinate={{
            latitude: marker.lat,
            longitude: marker.lng,
          }}
          key={marker.place_id}
          tracksViewChanges={false}
          image={require("@/assets/images/map-icon-light.png")}
          onPress={() => selectedButton === "map" ? setSelectedBakery(bakery) : {}}
        />
      );
    });


  return (
    <View style={styles.container}>
      {selectedButton === "map" && (
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={initialRegion}
            showsUserLocation={false}
            onRegionChangeComplete={handleRegionChangeComplete}
            userInterfaceStyle="dark"
          >
            {markers}
          </MapView>
          <BlinkingDot isMapView />
          {location && <MapShowListButton setSelectedButton={setSelectedButton} />}
          {location && (
            <MapCentraliseButton
              mapRef={mapRef}
              location={location}
              setLatestRegion={setLatestRegion}
            />
          )}
        </View>
      )}
      {selectedButton === "list" && (
        <View style={styles.listContainer}>
          <ThemedText type="title" style={styles.mapTitle}>
            Explore bakeries near you
          </ThemedText>
          <View style={styles.mapPreviewContainer}>
            <MapView
              ref={mapRef}
              style={styles.mapPreview}
              initialRegion={initialRegion}
              showsUserLocation={false}
              userInterfaceStyle="dark"
              scrollEnabled={false}
            >
              {markers}
            </MapView>
            <View style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <BlinkingDot />

              <LiveLocationText />

              <View style={{ position: 'absolute', top: 10, right: 10 }}>
                <TouchableOpacity style={styles.visitButton} onPress={() => setSelectedButton("map")}>
                  <ThemedText style={styles.visitButtonText} type="defaultSemiBold">
                    View map
                  </ThemedText>
                </TouchableOpacity>
              </View>

              {location && <MapCentraliseButton
                mapRef={mapRef}
                location={location}
                setLatestRegion={setLatestRegion}
                style={{ bottom: 8 }}
              />}
            </View>
          </View>
          <FlatList
            data={bakeries}
            renderItem={({ item }) => <BakeryView bakery={item} />}
            keyExtractor={(_, index) => index.toString()}
            ListEmptyComponent={
              <ThemedText type="default" style={{ alignSelf: "center", marginTop: 10 }}>
                Fetching nearby bakeries...
              </ThemedText>}
          />
        </View>
      )}

      <MapNearbyNewPostButton bakeries={bakeries.slice(0, 5)} />

      <Modal
        isVisible={!!selectedBakery}
        onBackdropPress={() => setSelectedBakery(null)}
        hasBackdrop
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{selectedBakery?.listing.name}</Text>
          <Text style={styles.modalText}>{selectedBakery?.listing.vicinity}</Text>
          <ThemedButton
            type="primary"
            style={{ paddingVertical: 16 }}
            onPress={() => {
              setSelectedBakery(null);
              router.push({
                pathname: `/${selectedBakery?.listing.name}`,
                params: { ...selectedBakery?.listing },
              });
            }}
          >
            View bakery posts
          </ThemedButton>
          <Text style={{ fontWeight: "300", alignSelf: "center" }}>
            {selectedBakery?.stats?.livePostsCount ?? 0} live lobangs,{" "}
            {(selectedBakery?.stats?.totalPosts ?? 0) -
              (selectedBakery?.stats?.livePostsCount ?? 0)}{" "}
            archived lobangs
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
    paddingTop: Constants.statusBarHeight + 8,
  },
  topContainer: {
    height: 50,
    flexDirection: "row",
  },
  mapContainer: {
    flex: 1,
  },
  mapPreviewContainer: {
    height: "25%",
  },
  mapPreview: {
    ...StyleSheet.absoluteFillObject,
  },
  mapTitle: {
    marginVertical: 8,
    marginLeft: 20,
    color: Colors.black,
  },
  visitButton: {
    backgroundColor: Colors.accent,
    padding: 8,
    borderRadius: 25,
    width: 150,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  visitButtonText: {
    textAlign: "center",
    color: Colors.white,
  },
  listContainer: {
    flex: 3,
    width: "100%",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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
