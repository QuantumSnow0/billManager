

const customers = [
  {
    customerId: 1,
    avatarImg: "https://i.pravatar.cc/150?img=1",
    profileImg: "https://i.pravatar.cc/300?img=1",
    name: "John Doe",
    phone: "+254700123456",
    location: "Nairobi, Kenya",
    bill: [
      {
        billId: 101,
        date: "2025-02-17",
        time: "10:30 AM",
        amount: 500,
        status: "Paid",
      },
      {
        billId: 102,
        date: "2025-02-16",
        time: "02:15 PM",
        amount: 1200,
        status: "Pending",
      },
      {
        billId: 103,
        date: "2025-02-15",
        time: "07:45 PM",
        amount: 900,
        status: "Paid",
      },
    ],
    mkula: false,
    imageUri: "https://i.pravatar.cc/400?img=1",
  },
  {
    customerId: 2,
    avatarImg: "https://i.pravatar.cc/150?img=2",
    profileImg: "https://i.pravatar.cc/300?img=2",
    name: "Jane Smith",
    phone: "+254711654321",
    location: "Mombasa, Kenya",
    bill: [
      {
        billId: 104,
        date: "2025-02-14",
        time: "09:00 AM",
        amount: 750,
        status: "Paid",
      },
      {
        billId: 105,
        date: "2025-02-12",
        time: "04:30 PM",
        amount: 1500,
        status: "Pending",
      },
    ],
    mkula: false,
    imageUri: "https://i.pravatar.cc/400?img=2",
  },
  {
    customerId: 3,
    avatarImg: "https://i.pravatar.cc/150?img=3",
    profileImg: "https://i.pravatar.cc/300?img=3",
    name: "Peter Kimani",
    phone: "+254722987654",
    location: "Kisumu, Kenya",
    bill: [
      {
        billId: 106,
        date: "2025-02-11",
        time: "06:00 PM",
        amount: 950,
        status: "Unpaid",
      },
      {
        billId: 107,
        date: "2025-02-10",
        time: "01:20 PM",
        amount: 600,
        status: "Paid",
      },
      {
        billId: 108,
        date: "2025-02-09",
        time: "03:45 PM",
        amount: 2000,
        status: "Pending",
      },
    ],
    mkula: false,
    imageUri: "https://i.pravatar.cc/400?img=3",
  },
  {
    customerId: 4,
    avatarImg: "https://i.pravatar.cc/150?img=4",
    profileImg: "https://i.pravatar.cc/300?img=4",
    name: "Fatuma Hassan",
    phone: "+254733789012",
    location: "Eldoret, Kenya",
    bill: [
      {
        billId: 109,
        date: "2025-02-08",
        time: "11:10 AM",
        amount: 300,
        status: "Paid",
      },
      {
        billId: 110,
        date: "2025-02-07",
        time: "05:25 PM",
        amount: 1750,
        status: "Unpaid",
      },
    ],
    mkula: false,
    imageUri: "https://i.pravatar.cc/400?img=4",
  },
  {
    customerId: 5,
    avatarImg: "https://i.pravatar.cc/150?img=5",
    profileImg: "https://i.pravatar.cc/300?img=5",
    name: "Kevin Ochieng",
    phone: "+254744321678",
    location: "Nakuru, Kenya",
    bill: [
      {
        billId: 111,
        date: "2025-02-06",
        time: "02:50 PM",
        amount: 450,
        status: "Paid",
      },
      {
        billId: 112,
        date: "2025-02-05",
        time: "08:10 AM",
        amount: 1200,
        status: "Pending",
      },
      {
        billId: 113,
        date: "2025-02-04",
        time: "06:30 PM",
        amount: 2200,
        status: "Paid",
      },
    ],
    mkula: false,
    imageUri: "https://i.pravatar.cc/400?img=5",
  },
];

console.log(customers);




export default customers;