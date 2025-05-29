import mongoose from "mongoose";

const DBconn = () => {
  mongoose
    .connect(process.env.MONGODB_URI, {
      dbName: "evoltsoft",
    })
    .then((res) => {
      console.log("Mongodb connected successfully", res.connection.name);
    })
    .catch((error) => {
      console.warn("Mongodb unable to connect", error);
      process.exit(1);
    });
};

export default DBconn;
