import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  PermissionsAndroid, 
  NativeModules, 
  SafeAreaView, 
  StatusBar,
  ToastAndroid,
  Alert,
} from 'react-native';

import { 
  EXTRATO, 
  ITAU_NUMBER, 
  LANCAMENTOS, 
  LANC_FUTUROS, 
  LIMITE, 
  MELHOR_DATA, 
  MELHOR_DATA_RESPONSE,
  RECARGA, 
  SALDO_CARTAO, 
  SALDO_CONTA, 
  SALDO_CONTA_RESPONSE, 
  SALDO_POUPANCA,
} from './src/variables';
  
import SmsListener from 'react-native-android-sms-listener';
import SendButton from './src/components/SendButton';
import { AccountNumberFormatter, SaldoFormatter } from './src/utils';

export default function App() {
  const [saldo, setSaldo] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  
  useEffect(() => {
    const subscription = SmsListener.addListener(msg => {
      console.info(msg);
      
      if (msg.originatingAddress !== "4828") return; 
      
      const message = msg.body;
      
      if (message.startsWith(SALDO_CONTA_RESPONSE)) {
        setSaldo(SaldoFormatter(message));
        setAccountNumber(AccountNumberFormatter(message));
        return;
      }
      
      Alert.alert("Retorno - SMS Itaú", message, [{text: "OK", onPress: () => {}}], {
        cancelable: true
      });
    });
    
    sendDirectSms(SALDO_CONTA); // para obter o valor do saldo na inicialização do aplicativo;
    
    return () => {
      subscription.remove();
    }
  }, []);
  
  const sendDirectSms = async (message) => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.SEND_SMS, {
        title: 'Itaú - Serviços por SMS',
        message: 'É necessário permissões para enviar e ler mensagens para buscar as informações dos serviços.',
        buttonNegative: 'Não, não quero usar o aplicativo.',
        buttonPositive: 'Beleza, bora lá!',
      });
      
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        NativeModules.DirectSms.sendDirectSms(ITAU_NUMBER, message);
        
        if (message === SALDO_CONTA && saldo !== "") {
          ToastAndroid.show("As informações de valor de saldo e número de conta serão atualizadas em tela, caso haja alteração.", ToastAndroid.LONG);
        }
        
      } else {
        console.log('SMS permission denied');
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  return (
    <SafeAreaView>  
      <View style={{...styles.container}}>
        <Text style={styles.title}>Itaú - Serviços por SMS</Text>
        
        <Text style={{fontWeight: 'bold', fontSize: 18}}>Saldo: {saldo === "" ? "--" : saldo}</Text>
        <Text style={{marginBottom: 16, fontWeight: 'bold', fontSize: 18}}>Número de Conta: {accountNumber === "" ? "--" : accountNumber}</Text>
        
        <Text style={{fontSize: 15, marginBottom: 16}}>Para utilizar corretamente, você precisa ter cadastrado o número deste telefone com a sua conta do Itaú.</Text>

        <View style={styles.cardsContainer}>
          
          <View style={styles.row}>
            <SendButton text="SALDO CONTA" handlePress={() => sendDirectSms(SALDO_CONTA)} />
            <SendButton text="SALDO POUPANÇA" handlePress={() => sendDirectSms(SALDO_POUPANCA)} />
            <SendButton text="EXTRATO" handlePress={() => sendDirectSms(EXTRATO)} />
          </View>
          
          <View style={styles.row}>
            <SendButton text="LANÇAMENTOS FUTUROS" handlePress={() => sendDirectSms(LANC_FUTUROS)} />
            <SendButton text="LANÇAMENTOS" handlePress={() => sendDirectSms(LANCAMENTOS)} />
            <SendButton text="RECARGA" handlePress={() => sendDirectSms(RECARGA)} />
          </View>
          
          <View style={styles.row}>
            <SendButton text="MELHOR DATA" handlePress={() => sendDirectSms(MELHOR_DATA)} />
            <SendButton text="LIMITE" handlePress={() => sendDirectSms(LIMITE)} />
            <SendButton text="SALDO CARTÃO" handlePress={() => sendDirectSms(SALDO_CARTAO)} />
          </View>
          
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: StatusBar.currentHeight + 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: 'bold'
  },
  cardsContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  card: {
    backgroundColor: '#fff',
    height: '100%',
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    
    borderRadius: 7,
    
    shadowColor: "rgba(0, 0, 0, 0.6)",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
    
  },
  cardText: {
    textAlignVertical: 'center',
    textAlign: 'center'
  },
  row: {
    marginTop: 15,
    flexDirection: 'row',
    height: 90,
    width: '100%',
    justifyContent: 'space-around'
  }
})

