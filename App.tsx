import React, { memo, useState, useEffect, useCallback, useMemo } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { AlphabetList } from "react-native-section-alphabet-list";
import { faker } from '@faker-js/faker';

const generateContacts = (count) => {
  const contacts = [];
  for (let i = 0; i < count; i++) {
    const sectionIndex = Math.floor(i / 100); 
    const sectionTitle = String.fromCharCode(65 + sectionIndex); 
    const contact = {
      key: `${sectionTitle}_${i % 100}`, 
      name: faker.internet.userName() || 'Unknown Name',
      phone: faker.phone.number() || 'Unknown Phone',
      photo: faker.image.avatar() || 'default-avatar-url',
      email: faker.internet.email() || 'unknown@example.com',
      sectionTitle,
    };
    contacts.push(contact);
  }
  return contacts;
};

const App = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const generateData = useMemo(() => {
    return async () => {
      const contacts = generateContacts(10000);
      setData(contacts);
      setLoading(false);
    };
  }, []);

  useEffect(() => {
    generateData();
  }, [generateData]);

  const getItemLayout = useCallback((data, index) => ({
    length: 80, 
    offset: 80 * index,
    index,
  }), []);

  const CustomItem = memo(({ item }) => (
    <View key={item.key} style={styles.listItemContainer}>
      <Image source={{ uri: item.photo }} style={styles.contactPhoto} />
      <View style={styles.contactDetails}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
        <Text style={styles.contactEmail}>{item.email}</Text>
      </View>
    </View>
  ));

  const CustomSectionHeader = memo(({ section }) => (
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionHeaderLabel}>{section.title}</Text>
    </View>
  ));

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <AlphabetList
      data={data}
      indexLetterStyle={{ 
        color: 'blue', 
        fontSize: 15,
      }}
      renderCustomItem={(item) => <CustomItem item={item} />}
      renderCustomSectionHeader={(section) => <CustomSectionHeader section={section} />}
      getItemLayout={getItemLayout}
      initialScrollIndex={0}
      maxToRenderPerBatch={10}
      windowSize={21}
    />
  );
};

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    height: 80, 
  },
  contactPhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactPhone: {
    fontSize: 14,
  },
  contactEmail: {
    fontSize: 14,
    color: 'gray',
  },
  sectionHeaderContainer: {
    backgroundColor: '#f2f2f2',
    padding: 10,
  },
  sectionHeaderLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;