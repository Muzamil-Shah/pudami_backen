import bcrypt from "bcryptjs";

const data = {
  users: [
    {
      name: "Head Maneger",
      email: "muzamil.shah@gmail.com",
      password: bcrypt.hashSync("123123", 8),
      isAdmin: true,
      profile: {
        img: "/img/onion.jpg",
        firstname: "user",
        lastname: "jan",
        gender: "male",
        phone: 8629019502,
        busniusename: "local shop",
        licencecode: "9872498dfg",
      },
    },
    {
      email: "user@gmail.com",
      password: bcrypt.hashSync("123123", 8),
      isAdmin: false,
      profile: {
        img: "/img/onion.jpg",
        firstname: "user",
        lastname: "jan",
        gender: "male",
        phone: 8629019502,
        busniusename: "local shop",
        licencecode: "9872498dfg",
      },
    },
  ],
  products: [
    {
      name: "onion",
      image: "/img/onion.jpg",
      price: 20,
      orderLimit: 2500,
      description: "this book consist of 4000 english  words which we use daly",
    },
    {
      name: "gralic",
      image: "/img/gralic.jpg",
      price: 120,
      orderLimit: 1000,
      description: "this book consist of 4000 english  words which we use daly",
    },
    {
      name: "potato",
      image: "/img/potato.jpg",
      price: 15,
      orderLimit: 2500,
      description: "this book consist of 4000 english  words which we use daly",
    },
    {
      name: "ginger",
      image: "/img/ginger.jpg",
      price: 250,
      orderLimit: 1000,
      description: "this book consist of 4000 english  words which we use daly",
    },
  ],
};

export default data;
