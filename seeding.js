// Import MongoDB Node.js driver
const MongoClient = require("mongodb").MongoClient;

// URL koneksi MongoDB
const url = "mongodb+srv://abdularifin6767:LPBgTgPUmfcJ5JMg@cluster0.p6qsuak.mongodb.net/";

// Nama database dan koleksi
const dbName = "weddingApp";
const collectionName = "Packages";

// Data yang ingin dimasukkan
const data = {
   name: "O2 Park Surabaya All in Package",
   imageUrl: [
      "https://london.bridestory.com/image/upload/dpr_1.0,f_auto,fl_progressive,q_80,h_0,w_700,c_fill,g_faces/v1/assets/whatsapp-image-2019-11-21-at-20.21.11-BkG5lfA7w.jpg",
      "https://london.bridestory.com/image/upload/dpr_1.0,f_auto,fl_progressive,q_80,h_0,w_700,c_fill,g_faces/v1/assets/whatsapp-image-2019-11-21-at-20.21.13-HJM9lfAmw.jpg",
      "https://london.bridestory.com/image/upload/dpr_1.0,f_auto,fl_progressive,q_80,h_0,w_700,c_fill,g_faces/v1/assets/whatsapp-image-2019-11-21-at-20.21.12-rkMqez0mv.jpg"
   ],
   description: `Wedding Planner & Organizer :
   -. 2 bride assistant, 1 head event, 1 event manager, 4 crew
   -. vendor arrangement 
   -. event tools
   -. technical meeting
   -. event concept & rundown
   -. one day service ( temu manten, akad/pemberkatan & resepsi)
   
   Catering 500pax :
   - 6 main course
   - 2 dessert - beverages
   - 2 stall**
   *catering vendor choosen by availability
   **on going promo
   
   Decoration :
   Aisle 6-8 meter, standing flower, wedding gate, wedding sign, lighting, flower gate, hand bouquet, groom corsage. 
   
   Photo & Video : 
   One Day service . Holy Matrimony, Reception, Highlight, Teaser, Cinematic, Documenter, Album colase 20*30 with box, Drone
   
   Master Ceremony 
   
   Entertaint 
   
   Invitation
   250 hardcopy, softcopy, digital invitation`,
   category: "VIP", // VIP diatas 100jt
   price: 124972500 // VIP diatas 100jt
};
// Fungsi untuk memasukkan data
async function insertData() {
   const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

   try {
      await client.connect();

      const db = client.db(dbName);
      const collection = db.collection(collectionName);

      // Memasukkan data ke dalam koleksi MongoDB
      const result = await collection.insertOne(data);
      console.log("Data berhasil dimasukkan. ID dokumen:", result.insertedId);
   } catch (error) {
      console.error("Gagal memasukkan data:", error);
   } finally {
      // Tutup koneksi
      client.close();
   }
}

// Panggil fungsi untuk memasukkan data
insertData();
