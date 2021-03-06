import React, { useState, useContext } from "react";
import { Text, Button, Content } from "native-base";
import { StyleSheet, Modal, View, TextInput, ScrollView } from "react-native";
import { StateContext } from "Listables/database-service/database-service";
import useNewItemsListReducer, {
  NewItemsContext
} from "Listables/hooks/new-items-hooks";
import { AddItemsContainer } from "Listables/components/add-items-container.js";
import { COLORS } from "Listables/constants/colors";

export const NewStoreModal = props => {
  return (
    <NewItemsContext.Provider value={useNewItemsListReducer()}>
      <ModalContent {...props} />
    </NewItemsContext.Provider>
  );
};

const ModalContent = ({ show, onCancel }) => {
  const [storeName, setStoreName] = useState("");
  const { updateItems, setLoading } = useContext(StateContext);

  const {
    state,
    clearList,
    addNewInputField,
    useAutoAddInputFieldEffect
  } = useContext(NewItemsContext);

  const { newItemsList, numberOfInputs } = state;

  useAutoAddInputFieldEffect();

  const onStoreCreate = () => {
    setLoading();
    updateItems({ store: { storeName }, items: newItemsList });
    setStoreName("");
    clearList();
    onCancel();
  };

  const handleCancel = () => {
    setStoreName("");
    clearList();
    onCancel();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={show}>
      <TransparentBackground />
      <Content contentContainerStyle={styles.contentContainer}>
        <View style={styles.mainView}>
          <View style={styles.formContainer}>
            <Text style={{ color: COLORS.WHITE }}>Enter new list name:</Text>
            <View style={styles.storeNameInput}>
              <TextInput
                value={storeName}
                onChangeText={text => setStoreName(text)}
                onSubmitEditing={() => addNewInputField()}
                returnKeyType="done"
                enablesReturnKeyAutomatically
                keyboardAppearance="dark"
                autoFocus={true}
                editable={true}
                placeholder={"ex: Sam's Club"}
                placeholderTextColor={COLORS.DARK_GRAY}
              />
            </View>
            {!!numberOfInputs && (
              <ScrollView style={styles.addItemsScrollContainer}>
                <AddItemsContainer
                  numberOfInputs={numberOfInputs}
                  newItemsList={newItemsList}
                  storeName={storeName}
                  additionalStyles={styles.addItemsContainerAdditionalStyles}
                />
              </ScrollView>
            )}
          </View>
          <ActionButtons
            onStoreCreate={onStoreCreate}
            onCancel={handleCancel}
          />
        </View>
      </Content>
    </Modal>
  );
};

const TransparentBackground = () => (
  <View style={styles.transparentBackground} />
);

const ActionButtons = ({ onStoreCreate, onCancel }) => (
  <View style={styles.buttonContainer}>
    <Button onPress={onStoreCreate}>
      <Text style={{ color: COLORS.WHITE }}>Add New Store</Text>
    </Button>
    <Button danger onPress={onCancel}>
      <Text>Cancel</Text>
    </Button>
  </View>
);

const styles = StyleSheet.create({
  transparentBackground: {
    height: "100%",
    width: "100%",
    position: "absolute",
    backgroundColor: COLORS.DARK_GRAY,
    opacity: 0.9
  },
  contentContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderWidth: 10
  },
  mainView: {
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    justifyContent: "space-between",
    backgroundColor: COLORS.DARK_GRAY,
    borderColor: COLORS.GRAY,
    zIndex: 10,
    height: "70%",
    width: "90%",
    borderRadius: 10,
    borderWidth: 0.5
  },
  formContainer: {
    display: "flex",
    height: "80%",
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10
  },
  storeNameInput: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginTop: 10,
    backgroundColor: COLORS.WHITE,
    borderWidth: 3
  },
  addItemsScrollContainer: {
    maxHeight: "70%",
    marginTop: 20,
    marginBottom: 0
  },
  addItemsContainerAdditionalStyles: {
    width: "80%",
    alignSelf: "center"
  },
  buttonContainer: {
    width: "90%",
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignSelf: "center",
    alignItems: "center"
  }
});
