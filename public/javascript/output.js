
//objects adding into array
variables_access={};



var labels=[];
var days=parseInt(document.getElementById("days").textContent);
for(var i=1;i<days+1;i++){
    labels.push(i);
}

let out=document.getElementById("open_price").textContent;
const checking=JSON.parse(out);
const ress=[];
for(var i in checking){
    ress.push(checking[i])
}
//const dates=ress[0];
const dates=ress[0]
const open=ress[1];
const high=ress[2];
const low=ress[3];
const close=ress[4];
const open_prediction=ress[5];
const high_prediction=ress[6];
const low_prediction=ress[7];
const close_prediction=ress[8];

function realPrice(){
    let openChart=document.getElementById("openChart").getContext("2d");
    let openLineChart=new Chart(openChart,{
        type:"line",
        data:{
            labels:dates,
            datasets:
        [
            {
                label:"open price",
                data:open,
                backgroundColor:"green",
                borderColor:"green",
                hoverBorderWidth:3,
                hoverBorderColor:"green"
            },
            {
                label:"high price",
                data:high,
                backgroundColor:"blue",
                borderColor:"blue",
                hoverBorderWidth:3,
                hoverBorderColor:"blue"
            },
            {
                label:"low price",
                data:low,
                backgroundColor:"red",
                borderColor:"red",
                hoverBorderWidth:3,
                hoverBorderColor:"red"
            },
            {
                label:"close price",
                data:close,
                backgroundColor:"black",
                borderColor:"black",
                hoverBorderWidth:3,
                hoverBorderColor:"black"
            }
        ]

        },
        options:{
            plugins:{
                legend:{
                    position:"top"
                },
                title:{
                    display:"true",
                    text:"last 30 open, high, low, close prices"
                }
            }
        }
    });
    variables_access.true_var=openLineChart;
}
function predictedPrice(){
    let preChart=document.getElementById("predictionChart").getContext("2d");
    let preLineChart=new Chart(preChart,{
        type:"line",
        data:{
            labels:labels,
            datasets:
        [
            {
                label:"prediction of open price",
                data:open_prediction,
                backgroundColor:"green",
                borderColor:"green",
                hoverBorderWidth:3,
                hoverBorderColor:"green"
            },
            {
                label:"prediction of high price",
                data:high_prediction,
                backgroundColor:"blue",
                borderColor:"blue",
                hoverBorderWidth:3,
                hoverBorderColor:"blue"
            },
            {
                label:"prediction of low price",
                data:low_prediction,
                backgroundColor:"red",
                borderColor:"red",
                hoverBorderWidth:3,
                hoverBorderColor:"red"
            },
            {
                label:"prediction of close price",
                data:close_prediction,
                backgroundColor:"black",
                borderColor:"black",
                hoverBorderWidth:3,
                hoverBorderColor:"black"
            }
        ]

        },
        options:{
            plugins:{
                legend:{
                    position:"top"
                },
                title:{
                    display:"true",
                    text:"future prices of selected company"
                }
            }
        }
    });
    variables_access.pre_var=preLineChart;

}

function trueDestroyer(){
    if(variables_access.true_var){
        var k=variables_access.true_var;
        k.destroy();
    }
}
function preDestroyer(){
    if(variables_access.pre_var){
        var m=variables_access.pre_var;
        m.destroy();
    }
}








