import React from 'react'
import {View, ActivityIndicator, Text, StyleSheet} from 'react-native'
import { COLORS } from 'GroceryLists/constants/colors';

const LoadingSpinner = () => {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" />
      <Text style={styles.loadingText}> Loading! Please wait! Jazzakallah Khair 😁</Text>
    </View>
  );
};

export { LoadingSpinner }
const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  loadingText: {
    color: COLORS.LIGHT_BLUE
  }
})