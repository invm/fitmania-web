import React, { useState } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { GoogleApiWrapper } from 'google-maps-react';
import { showMessage } from '../../redux/actions';
import { useTranslation } from 'react-i18next';
import { TextField } from '@material-ui/core';

const PlacesAutoComplete = ({
  handleSelect,
  value,
}: {
  handleSelect: (address: string, coordinates: number[]) => void;
  value: string;
}) => {
  const [query, setQuery] = useState(value ?? '');
  const { t } = useTranslation();

  const select = async (addressString: string) => {
    try {
      const results = await geocodeByAddress(addressString);

      if (!results.length) {
        showMessage(t('components.places_autocomplete.address_not_found'), 'error');
        return;
      }

      const latLng = await getLatLng(results[0]);

      if (!latLng.lat || !latLng.lng) {
        showMessage(t('components.places_autocomplete.address_not_found'), 'error');
        return;
      }

      setQuery(results?.[0]?.formatted_address);
      handleSelect(results?.[0]?.formatted_address, Object.values(latLng));
    } catch (err) {
      console.error('Error', err);
      showMessage(t('components.places_autocomplete.address_not_found'), 'error');

      return;
    }
  };

  return (
    <PlacesAutocomplete
      searchOptions={{ componentRestrictions: { country: 'il' } }}
      value={query}
      onChange={(e) => setQuery(e)}
      onSelect={select}
    >
      {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
        <div style={{ width: '100%' }}>
          <TextField
            {...getInputProps({
              placeholder: 'Search Places ...',
              className: 'location-search-input',
            })}
            id="post-text"
            label="Specify location..."
            placeholder=""
            multiline
            name="text"
            variant="outlined"
            style={{ width: '100%' }}
          />
          <div className="autocomplete-dropdown-container" style={{ position: 'absolute', zIndex: 999 }}>
            {loading && <div>Loading...</div>}
            {suggestions.map((suggestion, i) => {
              const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
              // inline style for demonstration purpose
              const style = {
                padding: 8,
                ...(suggestion.active
                  ? { backgroundColor: '#ccc', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' }),
              };
              return (
                <div
                  {...getSuggestionItemProps(suggestion, {
                    className,
                    style,
                  })}
                  key={suggestion.placeId}
                >
                  <span>{suggestion.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PlacesAutocomplete>
  );
};

export default GoogleApiWrapper({
  apiKey: `${process.env.REACT_APP_GOOGLE_API_KEY}`,
  language: 'en',
  // @ts-ignore
})(PlacesAutoComplete);
