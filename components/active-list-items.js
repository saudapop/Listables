import React, { useEffect, useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  RefreshControl,
  ActivityIndicator,
  FlatList
} from "react-native";
import { Content, SwipeRow, Button, Icon } from "native-base";
import { StateContext } from "GroceryLists/database-service/database-service";
import { StoreHeader } from "GroceryLists/components/store-header";
const ActiveListItems = () => {
  const {
    state,
    initialFetch,
    updateItems,
    refresh,
    setCurrentStore
  } = useContext(StateContext);
  const [refs, setRefs] = useState({});
  const [currentRow, setCurrentRow] = useState(null);

  useEffect(() => {
    if (!state.stores.length) initialFetch();

    return () => {
      state.client.auth
        .logout()
        .then(() => {
          console.log(`Successfully logged out`);
        })
        .catch(err => {
          console.log(`Failed to log out: ${err}`);
        });
    };
  }, []);

  (function closeSelectedStoreOnItemSwipe() {
    useEffect(() => {
      if (currentRow) {
        currentRow._root.closeRow();
      }
    }, [state.currentStore]);
  })();

  (function closeSelectedItemOnStoreSwipe() {
    useEffect(() => {
      if (state.currentStore) {
        setCurrentStore(null);
      }
    }, [currentRow]);
  })();

  const activeListItems = state.stores
    .sort((a, b) => a.storeName > b.storeName)
    .map(store => (
      <React.Fragment key={store.storeName}>
        <StoreHeader store={store} />
        <FlatList
          data={store.items.filter(item => item.isActive === true)}
          renderItem={({ item, index }) => (
            <SwipeRow
              ref={c => {
                const newRefs = refs;
                newRefs[item.name] = c;
                setRefs(newRefs);
              }}
              onRowOpen={() => {
                if (currentRow && currentRow !== refs[item.name]) {
                  currentRow._root.closeRow();
                }
                setCurrentRow(refs[item.name]);
              }}
              key={item.name}
              style={{
                ...styles.itemContainer,
                backgroundColor: index % 2 ? "#edf7ff" : "#c4def2"
              }}
              rightOpenValue={-50}
              right={
                <Button
                  danger
                  onPress={async () => {
                    updateItems({ store, items: [item.name], state });
                    setCurrentRow(null);
                  }}
                >
                  <Icon active name="trash" />
                </Button>
              }
              body={
                <View style={styles.itemNameContainer}>
                  <Icon
                    small
                    name="ios-arrow-forward"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingTop: 3,
                      paddingRight: 10,
                      paddingLeft: 35,
                      fontSize: 15,
                      color: "gray"
                    }}
                  />
                  <Text style={styles.itemName}>{item.name}</Text>
                </View>
              }
            />
          )}
        />
      </React.Fragment>
    ));

  return !state.isLoading ? (
    <Content
      keyboardShouldPersistTaps="never"
      refreshControl={
        <RefreshControl
          refreshing={state.isLoading}
          onRefresh={() => refresh(state)}
        />
      }
    >
      <View style={styles.storesList}>
        {state.stores.length && activeListItems}
      </View>
    </Content>
  ) : (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="green" />
      <Text> Loading! Please wait! Jazzakallah Khair 😁</Text>
    </View>
  );
};

export { ActiveListItems };

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  storesList: {
    flex: 1,
    backgroundColor: "#fff"
  },
  itemContainer: {
    display: "flex",
    borderTopWidth: 0.15,
    borderBottomWidth: 0.15
  },
  itemNameContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  swipeButtonText: {
    color: "white",
    fontSize: 15
  },
  itemName: {
    fontSize: 20
  }
});
