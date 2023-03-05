import {StyleSheet, Text, View, Button, FlatList, TouchableOpacity, Image, RefreshControl, Linking} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {useEffect, useState} from "react";
import { Searchbar } from 'react-native-paper';
import {Touchable} from "react-native-web";
import ImageLoader from "react-native-web/src/modules/ImageLoader";

function CountriesScreen({navigation}) {
    const [isLoading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const [SearchQuery, setSearchQuery] = useState('');
    const onChangeSearch = (query) => {
        setSearchQuery(query)
        if(query.length>=3) {
            searchCountries(query)
        }
        else if(query.length==0){
            fetchCountries()
        }
    }

    function fetchCountries() {
        setSearchQuery('')
        fetch('https://restcountries.com/v3.1/all')
            .then((response) => response.json())
            .then((json) => {
                setData(json)
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    function searchCountries(query) {
        setLoading(true)
        fetch('https://restcountries.com/v3.1/name/' + query)
            .then((response) => response.json())
            .then((json) => {
                setData(json)
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    useEffect(()=>{
        fetchCountries()
    },[])

    return (
        <View style={styles.container}>
            <Searchbar
                placeholder="Search"
                onChangeText={(query) => onChangeSearch(query)}
                value = {SearchQuery}
            />
            <Text style={styles.counter}>{data.length>=1?data.length:0} countries</Text>
            {isLoading ? (<Text>"Loading..."</Text>) : (
            <FlatList
                data={data}
                keyExtractor={({ name }, index) => name.common}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading}
                        onRefresh={fetchCountries}
                    />
                }
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('CountryDetailsScreen',item)}>
                        <Text>{item.name.common}</Text>
                    </TouchableOpacity>
                )}
            />
            )}
        </View>
  );
}
function CountryDetailsScreen({route}) {
  const country = route.params;
  return (
    <View style={styles.container}>
        <Image source={{ uri: "https://flagcdn.com/80x60/" + country.cca2.toLowerCase() + ".png"}} style={styles.flag}/>
        <Text style={styles.counter}>{country.name.common}</Text>
        <Text>Official name: {country.name.official}</Text>
        <Text>Capitol: {country.capital}</Text>
        <Text>Continents: {country.continents.map((t) => " " + t)+ ""}</Text>
        <Text>Time zones:
            {country.timezones.map((t) => " " + t) + ""}
        </Text>
        <Text>Population: {country.population}</Text>
        <Text> Languages:
            {Object.keys(country.languages).map((key,i)=> " " + country.languages[key]) + ""}
        </Text>
        <Text style={{color: 'blue'}}
              onPress={() => Linking.openURL(country.maps.googleMaps)}>
            See on Google Maps
        </Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="CountriesScreen" component={CountriesScreen} options={{ title: 'Countries' }} />
        <Stack.Screen name="CountryDetailsScreen" component={CountryDetailsScreen} options={{ title: 'Country Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    margin: 20,
    fontSize: 18,
  },
  flag: {
    width: 80,
    height: 60
  },
  counter:{
      color: 'green',
      fontSize: 24
  }
});
