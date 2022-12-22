import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph } from 'react-native-paper';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const search = () => {
   // check if searchTerm is not empty
    if (searchTerm.trim() === '') {
      setIsLoading(false); // show the loading indicator
      return; // do not make the API call if searchTerm is empty
    }

    setIsLoading(true); // show the loading indicator
    // fetch repos from Github API, limiting the results to 1000
    fetch(`https://api.github.com/search/repositories?q=${searchTerm}&per_page=1000`)
      .then(response => response.json())
      .then(data => {
        // filter out repos with empty languages
        const filteredResults = data.items.filter(repo => repo.language !== null && repo.language !== '');

        // group repos by language and count occurrences
        const groupedResults = filteredResults.reduce((acc, repo) => {
          if (!acc[repo.language]) {
            acc[repo.language] = 1;
          } else {
            acc[repo.language] += 1;
          }
          return acc;
        }, {});

        // sort languages by occurrence descending
        const sortedResults = Object.entries(groupedResults).sort((a, b) => b[1] - a[1]);

        setResults(sortedResults);
        setTotalCount(data.total_count);
        setIsLoading(false); // hide the loading indicator
      });
  };

  return (
    <View style={{ flex: 1, padding: 10, marginTop: 20 }}>
      <Card style={{ marginBottom: 16 }}>
        <Card.Content>
          <TextInput
            value={searchTerm}
            onChangeText={text => setSearchTerm(text)}
            placeholder="Enter search term"
            style={{ marginBottom: 16 }}
          />
          <Button mode="contained" onPress={search}>
            Go
          </Button>
        </Card.Content>
      </Card>
      {isLoading ? (
        // show the loading indicator if isLoading is true
        <ActivityIndicator />
      ) : (
        <ScrollView>
          {results.map(([language, count]) => (
            <Card key={language} style={{ marginBottom: 16 }}>
              <Card.Content>
                <Title>{language}</Title>
                <Paragraph>{count} occurrences</Paragraph>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      )}
      <Text>{totalCount} total result(s) found</Text>
    </View>
  );
};

export default App;