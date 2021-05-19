# -*- coding: utf-8 -*-
"""
Created on Thu Apr 29 20:43:06 2021

@author: work
"""

bools=True
try:
    import sys
    import pandas as pd
    from yahoo_fin.stock_info import get_data
    from sklearn.preprocessing import MinMaxScaler
    from keras.models import Sequential
    from keras.layers import Dense
    from keras.layers import LSTM
    import numpy as np
except Exception as e:
    print(e)
    bools=False



#importing datasets

if(bools):
    try:
        a=sys.argv[1]
        days=sys.argv[2]
        days=int(days)
        datas=get_data(a,start_date="01/01/2001",index_as_date=False)
    except Exception as e2:
        print("no such company with Symbol "+a+" exist")
        bools=False

#converting dates into str date fromat
        
datas["date"]=[int(str(i)[0:4]+str(i)[5:7]+str(i)[8:10]) for i in datas["date"]]


#handling missing data
try:
    datas=datas.dropna()
    datas.drop(["adjclose","volume","ticker"],axis=1,inplace=True)
except Exception as e3:
    print(e3)

dates=list(datas.iloc[len(datas)-31:,0].values)
open_price=list(datas.iloc[len(datas)-31:,1].values)
high_price=list(datas.iloc[len(datas)-31:,2].values)
low_price=list(datas.iloc[len(datas)-31:,3].values)
close_price=list(datas.iloc[len(datas)-31:,4].values)



#data scaling
try:
    scaler1=MinMaxScaler()
    scaler2=MinMaxScaler()
    scaler3=MinMaxScaler()
    scaler4=MinMaxScaler()
    datas["open"]=scaler1.fit_transform(datas["open"].values.reshape(-1,1))
    datas["high"]=scaler2.fit_transform(datas["high"].values.reshape(-1,1))
    datas["low"]=scaler3.fit_transform(datas["low"].values.reshape(-1,1))
    datas["close"]=scaler4.fit_transform(datas["close"].values.reshape(-1,1))


#prediction using rnn
#train_datd 

except Exception as e22:
    print(e22)

train_data=datas.iloc[:,1:5].values


def data_process(data,column):
    x_train=[]
    y_train=[]
    for i in range(8,len(data)):
        x_train.append(data[i-8:i,column])
        y_train.append(data[i,column])
        
    x_train,y_train=np.array(x_train),np.array(y_train)
    x_train=np.reshape(x_train,(x_train.shape[0],x_train.shape[1],1))
    return [x_train,y_train]

#data preprocessing for RNN
try:
    x_train_open,y_train_open=data_process(train_data,0)
    x_train_high,y_train_high=data_process(train_data,1)
    x_train_low,y_train_low=data_process(train_data,2)
    x_train_close,y_train_close=data_process(train_data,3)
except Exception as e8:
    print(e8)



#creating machine learning model
def training_layers(x_train,y_train):
    model=Sequential()
    
    model.add(LSTM(units=50,return_sequences=True,input_shape=(x_train.shape[1],1),activation="tanh"))
    
    model.add(LSTM(units=50,return_sequences=True,activation="tanh"))
    
    model.add(LSTM(units=50,return_sequences=True,activation="tanh"))
    
    model.add(LSTM(units=50,activation="tanh"))
    
    model.add(Dense(units=1))
    
    model.compile(optimizer="adam",loss='mean_squared_error')
    
    
    model.fit(x_train,y_train,epochs=10,batch_size=100,verbose=0)
    
    return model
try:
    model_open=training_layers(x_train_open,y_train_open)
    model_high=training_layers(x_train_high,y_train_high)
    model_low=training_layers(x_train_low,y_train_low)
    model_close=training_layers(x_train_close,y_train_close)
except Exception as e7:
    print(e7)

#prediction future prices based on given input
#days 10
def predictor(days,model,datas,column,scaler):
    trainer=datas.iloc[len(datas)-8:,column].values
    output=[]
    for i in range(days):
        trainer=np.reshape(trainer,(1,trainer.shape[0],1))
        prediction=model.predict(trainer)
        output.append(scaler.inverse_transform(prediction)+0.004*scaler1.inverse_transform(np.array([trainer[trainer.shape[0]-1],]).reshape(-1,1))[0][0])
        trainer=np.delete(trainer,0)
        trainer=np.append(trainer,prediction)
    output=np.array(output)
    output=np.reshape(output,(output.shape[0],))
    output=output.tolist()
    return output
try:
    open_prediction=predictor(days,model_open,datas,1,scaler1)
    high_prediction=predictor(days,model_high,datas,2,scaler2)
    low_prediction=predictor(days,model_low,datas,3,scaler3)
    close_prediction=predictor(days,model_close,datas,4,scaler4)
except Exception as es:
    print(es)

try:
    output_list=[dates,open_price,high_price,low_price,close_price,open_prediction,high_prediction,low_prediction,close_prediction]
    print(output_list)


except Exception as e5:
    print("asdffda")





















