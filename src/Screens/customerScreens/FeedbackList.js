import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const FeedbackList = ({ feedbacks }) => {
  const renderItem = ({ item }) => (
    <View style={styles.feedbackItem}>
      <Text style={styles.username}>{item.username}</Text>
      <Text>{item.comment}</Text>
      <Text>Rating: {item.rating}/5</Text>
    </View>
  );

  return (
    <FlatList
      data={feedbacks}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.feedbackContainer}
    />
  );
};

const styles = StyleSheet.create({
  feedbackContainer: {
    padding: 10,
  },
  feedbackItem: {
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    elevation: 1,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default FeedbackList;
