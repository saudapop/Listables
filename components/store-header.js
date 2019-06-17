import React, { useContext, useEffect } from "react";
import { StateContext } from "../database-service/database-service";
import useNewItemsListReducer, {
  NewItemsContext
} from "../hooks/new-items-reducer";
import { StyleSheet, View, TouchableOpacity, Text, Button } from "react-native";
import { NewItemField } from "./new-item-field";

export const StoreHeader = ({ store }) => {
  return (
    <NewItemsContext.Provider value={useNewItemsListReducer()}>
      <HeaderContent store={store} />
    </NewItemsContext.Provider>
  );
};

const HeaderContent = ({ store }) => {
  const { updateItems } = useContext(StateContext);

  const { state, clearList, setIsAddingNewItems, setInputFields } = useContext(
    NewItemsContext
  );

  const { newItemsList, inputFields, isAddingNewItems } = state;

  const addNewInputField = () => {
    console.log(state);

    const isListEmpty = !newItemsList.length && inputFields.length < 1;
    const needMoreInputs = newItemsList.length >= inputFields.length;

    if (isListEmpty || needMoreInputs) {
      let newInputFields = [...inputFields];
      newInputFields.push(<NewItemField />);
      setInputFields(newInputFields);
      if (!isAddingNewItems) {
        setIsAddingNewItems(true);
      }
    }
  };

  useEffect(() => {
    if (isAddingNewItems) {
      addNewInputField();
    }
  }, [newItemsList]);

  return (
    <>
      <View style={styles.header}>
        <View>
          <Text style={styles.storeName}>{store.storeName}</Text>
        </View>
        <TouchableOpacity
          style={styles.toggleInputButton}
          onPress={addNewInputField}
          accessible={true}
        >
          <View style={styles.buttonTextContainer}>
            <Text style={styles.buttonOpen}>{"+"}</Text>
          </View>
        </TouchableOpacity>
      </View>
      {inputFields && inputFields.map(input => input)}
      {newItemsList[0] && (
        <Button
          title={`Add ${newItemsList.join(", ")} to ${store.storeName} list`}
          onPress={() => {
            updateItems({ store, items: newItemsList });
            clearList();
          }}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    backgroundColor: "#DEDEDE",
    borderColor: "#DDDDDD",
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5
  },
  input: {
    maxWidth: 100,
    padding: 1,
    position: "relative"
  },
  storeName: {
    fontWeight: "bold",
    fontSize: 25
  },
  toggleInputButton: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
    padding: 0.5,
    backgroundColor: "#DDDDDD",
    borderRadius: 50,
    borderWidth: 0.25,
    width: 20,
    height: 20
  },
  buttonTextContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    fontSize: 20
  },
  buttonOpen: {
    color: "green"
  },
  buttonClose: {
    color: "red"
  }
});
