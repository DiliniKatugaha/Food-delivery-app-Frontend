import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../Components/Header';

function SignUpSelection(){
  const navigation = useNavigation();

  const handleCustomerSignUp = () => {
    navigation.navigate('CustomerSignUp');
  };

  const handleRestaurateurSignUp = () => {
    navigation.navigate('RestaurantSignUp');
  };

  return (
    <View style= {styles.signUp}>
        <Header title="Sign Up" type="arrow-left" />

            <View style={styles.container}>
                <Text style={styles.title}>Sign Up</Text>
                
                <TouchableOpacity style={styles.button} onPress={handleCustomerSignUp}>
                    <Text style={styles.buttonText}>Customer</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.restaurateurButton]} onPress={handleRestaurateurSignUp}>
                    <Text style={styles.buttonText}>Restaurateur</Text>
                </TouchableOpacity>
            </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  signUp: {
    flex: 1,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
    color: '#4CAF50', 
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  restaurateurButton: {
    backgroundColor: '#388E3C', 
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default SignUpSelection;
