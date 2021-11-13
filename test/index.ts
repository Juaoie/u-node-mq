console.log("测试index.ts执行");
import UNodeMQ from "../dist/UNodeMQ";
const unmq = new UNodeMQ();
div
{{a.value}} //// 123
div
//创建组合报告交换机
//STUDENT_DATA 学生数据
const exc = unmq.createExchange("COMBO_REPORT", ["STUDENT_DATA"], null);

const que = unmq.createQueue("STUDENT_DATA");

unmq.emit<number>("COMBO_REPORT", 123);


const aoff= unmq.ref<string>("STUDENT_DATA");

a =  unmq.off<string>("STUDENT_DATA");

function ref(){
let aproxy=null
 const aoff= unmq.on<string>("STUDENT_DATA",(data)=>{
    aproxy=data
  });
 const b= new Proxy(
  {},
  {
    get(targt,p){
      if(p === "value"){
        return aproxy
      }else if(p === "off"){
        return aoff
      }
    }
  }
 )
 return b
} 


destroyed() {
  a.off()
},
unmq.off("STUDENT_DATA", fun);



function tun(){
  
}

function fun(data: string) {
  a = data;
}


