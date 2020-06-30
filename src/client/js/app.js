//const baseURL = 'http://api.geonames.org/postalCodeSearchJSON?placename='; 
//const apiKey = '&county=US&maxRows=10&username=marz';

const d = new Date();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let today = months[d.getMonth()] +'/'+ d.getDate() +'/'+ d.getFullYear();
let city = '';
let tripDate = '';
let tstorm = '';

//add event listener for the button and create function

document.getElementById('generate').addEventListener('click', performAction);

function performAction(e){
	 city = document.getElementById('city').value;
	 //tripDate = document.getElementById('tripDay').value;

	 postData('http://localhost:8082/', { city: city, tripDate: tripDate })
	 	.then(function(){
	 		getData('http://localhost:8082/weather')
	 	})
      .then(function(){
        updateUI('http://localhost:8082/weather')
      })
        .then(function(){
          updatePics('http://localhost:8082/pics')
        })
          .then(function(){
            dates()
          })
        
	}

// post data to the post route

const postData = async ( url = '', data = {}) =>{
	const response = await fetch(url, {
		method: 'POST',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	try{
		const newData = await response.json();
	}catch(error){
		console.log("error at post data", error);
	}
}

//get data from server

const getData = async (url) =>{
	const res = await fetch(url)
    try{
        const data = await res.json();
        //console.log(data
        return data;
    } catch(error) {
        console.log("error at getData", error);
    }
}

//update UI with data from getData route

const updateUI = async (url) => {
  const request = await fetch(url);
  try{
    const allData = await request.json();
    console.log(allData)
    let last = allData.length - 1;
    let weatherDes = allData[`${last}`].res_json.data[0].weather.description;
    let day = document.getElementById('day').value;
    document.getElementById('weather').innerHTML = `Your trip is on ${day} and the weather will be ${weatherDes}`;
  }catch(error){
    console.log("error at updateUI", error);
  }
}

// update pics

const updatePics = async (url) => {
  const request = await fetch(url);
  try{
    const allData = await request.json();
    let last = allData.length - 1;
    let img = allData[`${last}`].pic_res.hits[0].largeImageURL
    document.getElementById('img').setAttribute('src', img);
  }catch(error){
    console.log("error at updateUI", error);
  }
}

// get days

const  dates = async () => {
  let start = document.getElementById('day').value;
  let end = document.getElementById('endDay').value;

  let startDay = start.replace(/\-/g, '');
  let endDay = end.replace(/\-/g, '');

  let date1 = new Date(start)
  let date2 = new Date(end)

  let diffInTime = date2.getTime() - date1.getTime();
  let diffInDays = diffInTime / (1000 * 3600 * 24);

  document.getElementById('dates').innerHTML = `Your trip is ${diffInDays} days long`

}
