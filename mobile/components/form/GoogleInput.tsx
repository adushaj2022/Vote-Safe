import React, { createRef, useEffect } from "react";
import { InteractionManager } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { googleApiKey, inputVariant } from "../../constants/Extras";
import { formActionCreators } from "../../redux";
import { State } from "../../redux/reducers/rootReducer";
import { TRegisterForm } from "../../types";

const color = inputVariant === "filled" ? "#E5E5E5" : "#fff";

interface GoogleInputProps {
  navigation: any; // lets try to find a good way to get the type without ts crying
}

const inputRef = createRef<any>();

const GoogleInput: React.FunctionComponent<GoogleInputProps> = ({
  navigation,
}) => {
  const dispatch = useDispatch();
  const { SetFormInfo } = bindActionCreators(formActionCreators, dispatch);
  const state = useSelector((state: State) => state.registerForm);
  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      inputRef.current.focus();
    });
  }, []);

  return (
    <GooglePlacesAutocomplete
      placeholder="201 East 80th Street, New York, NY, USA"
      ref={inputRef}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        const info = data.description.split(", ");
        SetFormInfo({
          ...state,
          address: info[0],
          city: info[1],
          state: info[2],
          country: info[3],
        } as TRegisterForm);
        navigation.push("EnterMoreInfoTwo");
      }}
      query={{
        key: googleApiKey,
        language: "en",
      }}
      styles={{
        textInput: {
          backgroundColor: color,
          width: "100%",
          borderWidth: 1,
          borderColor: "#f6f6f6",
        },

        container: { padding: 15, backgroundColor: "#fff" },
      }}
    />
  );
};

export default GoogleInput;
