import{MongoClient}from "mongodb"
import{ApolloServer}from "@apollo/server"
import { startStandaloneServer } from "npm:@apollo/server@4.1/standalone";
import { vuelos, vuelosDb } from "./types.ts";
import { frommdoletoflight } from "./utilities.ts";

const MONGO_URL=Deno.env.get("MONGO_URL")

if(!MONGO_URL){
  console.log("url is not set")
  Deno.exit(1)
}

const client=new MongoClient(MONGO_URL)
await client.connect()
console.info("conected to mongodb")

const db=client.db("CompaniaAerea")
const vueloscollection=db.collection<vuelosDb>("vuelos")

const schema=`#graphql
  type vuelos{
    _id:String
    Origen:String,
    Destino:String,
    FechaH:String
  }
  type Query{
    getFlights(origen:String,destino:String):[vuelos!]!
    getFlight(id:String):vuelos
  }
  

`
const resolvers={
  Query:{
    getFlights:async(_:unknown,args:{origen:string,destino:string}):Promise<vuelos[]>=>{
      if(args.origen==null && args.destino==null){
        console.log("null")
        const vuelosDB=await vueloscollection.find().toArray()
        const vuelos=vuelosDB.map((v)=>frommdoletoflight(v))
        return vuelos
      }
      else if(args.destino==null){
        const vuelosDB=await vueloscollection.find({Origen:args.origen}).toArray()
        const vuelos=vuelosDB.map((v)=>frommdoletoflight(v))
        return vuelos
      }
      else if(args.origen==null){
        const vuelosDB=await vueloscollection.find({Destino:args.destino}).toArray()
        const vuelos=vuelosDB.map((v)=>frommdoletoflight(v))
        return vuelos
      }
      
    }

  }
}




const server=new ApolloServer({
  typeDefs:schema,
  resolvers
})

const{url}=await startStandaloneServer(server,{listen:{port:8081}})

console.log(`Server running on:${url}`);

