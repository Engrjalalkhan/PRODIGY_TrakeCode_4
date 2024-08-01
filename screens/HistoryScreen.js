import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, RefreshControl, SafeAreaView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HistoryScreen = ({ route }) => {
  const [history, setHistory] = useState(route.params.history);
  const [refreshing, setRefreshing] = useState(false);

  const clearHistory = () => {
    setHistory([]);
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a refresh by resetting the history with new data
    // In a real application, you would fetch new data from your data source
    setTimeout(() => {
      setHistory(route.params.history); // Assuming new data is available here
      setRefreshing(false);
    }, 1000); // Simulate network delay
  };

  const renderItem = ({ item }) => {
    if (item.isDraw) {
      return (
        <View style={styles.drawCard}>
          <Text style={styles.cardText}>Draw</Text>
          <Icon name="star" size={30} color="#FFD700" style={styles.awardIcon} />
        </View>
      );
    }

    return (
      <View style={styles.card}>
        <Text style={styles.cardText}>Winner: Player {item.winner}</Text>
        {item.winner === 'X' && <Icon name="star" size={30} color="#0000FF" style={styles.awardIcon} />}
        {item.winner === 'O' && <Icon name="star" size={30} color="#FF0000" style={styles.awardIcon} />}
        <Text style={styles.cardText}>Loser: Player {item.loser}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#FF6347', '#4682B4']} // Customize the refresh control color
            />
          }
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={clearHistory}>
        <Text style={styles.buttonText}>Clear History</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  drawCard: {
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  cardText: {
    fontSize: 18,
    color: '#333',
  },
  awardIcon: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: '#FF6347',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    margin: 20,
    marginBottom: 30, // Extra margin to ensure it's not too close to the bottom
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HistoryScreen;
