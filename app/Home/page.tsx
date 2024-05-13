"use client"
import  Sidebar from"../_Components/sidebar";
import  Header from"../_Components/header";
import AddIcon from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
function Home() {
  return (
    <> 
    <div className="App">
       
       <Header/>
       <Sidebar/>
       <p className="text-center text-gray-700 mt-4">Looks like you're not part of any communities. Click below to explore communities</p>

      
    </div>

    <Fab variant="extended" style={{ position: 'fixed', bottom: '40px', right: '20px', backgroundColor:'#bcd727', color:'white' }}>
  <AddIcon sx={{ mr: 1 }} />
  Create Community
</Fab>


    </>
  );
}

export default Home;
