import React, { useContext, useEffect } from "react";
import { StyleSheet, View, RefreshControl } from "react-native";
import { Content } from "native-base";
import { StateContext } from "GroceryLists/database-service/database-service";
import { StoreHeader } from "GroceryLists/components/store-header";
import { ActiveStoreItems } from "GroceryLists/components/active-store-items";
import { LoadingSpinner } from "GroceryLists/components/loading-spinner";
import { COLORS } from "GroceryLists/constants/colors";
import { useCurrentRowState } from "GroceryLists/hooks/current-row-state";

const CurrentLists = () => {
  const { state, setCurrentStore, refresh } = useContext(StateContext);
  const { refs, setRefs, currentRow, setCurrentRow } = useCurrentRowState();

  (function closeSelectedItemOnStoreSwipe() {
    useEffect(() => {
      if (currentRow) {
        currentRow._root.closeRow();
      }
    }, [state.currentStore]);
  })();

  (function closeSelectedStoreOnItemSwipe() {
    useEffect(() => {
      if (state.currentStore) {
        setCurrentStore(null);
      }
    }, [currentRow]);
  })();

  const content = state.stores
    .sort((a, b) => a.storeName > b.storeName)
    .map(store => (
      <React.Fragment key={store.storeName}>
        <StoreHeader store={store} />
        <ActiveStoreItems
          store={store}
          items={store.items.filter(item => item.isActive === true)}
          currentRowState={{
            refs,
            setRefs,
            setCurrentRow,
            currentRow
          }}
        />
      </React.Fragment>
    ));

  return !state.isLoading ? (
    <Content
      style={styles.contentContainer}
      keyboardShouldPersistTaps="never"
      refreshControl={
        <RefreshControl
          refreshing={state.isLoading}
          onRefresh={() => refresh(state)}
        />
      }
    >
      <View style={styles.storesListContainer}>
        {state.stores.length && content}
      </View>
    </Content>
  ) : (
    <LoadingSpinner />
  );
};

export { CurrentLists };

const styles = StyleSheet.create({
  contentContainer: {
    marginBottom: 1,
    marginTop: 1
  },
  storesListContainer: {
    flex: 1,
    backgroundColor: COLORS.DARK_GRAY
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
  itemName: {
    fontSize: 20
  },
  listIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 3,
    paddingRight: 10,
    paddingLeft: 35,
    fontSize: 15,
    color: COLORS.DARK_GRAY
  }
});
