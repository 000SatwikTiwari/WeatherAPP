 document.querySelector(".bar").addEventListener("click", () => {

            document.querySelector(".search").insertAdjacentHTML("beforeend", `<div class="suggestion">
            <div class="list">
            
                
                

            </div>
        </div> `)

            //input wala code yhi se kr
            document.querySelector(".bar").addEventListener("input", async () => {
                let city = document.querySelector(".bar").value.trim();
                if (city.length < 2) return;



                let url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10&language=en&format=json`;

                try {
                    let res = await fetch(url);

                    if (!res.ok) {
                        throw new Error("Something went wrong!");
                    }

                    let data = await res.json();

                    console.log(data);

                    let arr = [];

                    for (let i in data.results) {
                        arr.push(data.results[i].name + ` , ` + data.results[i].country + ` , ` + data.results[i].admin1);
                    }

                    console.log(arr);
                    document.querySelector(".list").innerHTML = "";


                    if (arr.length === 0) {
                        document.querySelector(".list").innerHTML = `<div class="city WRONG">No city exist</div>`;
                    }
                    else {
                        arr.forEach((e) => {
                            document.querySelector(".list").insertAdjacentHTML(
                                "beforeend",
                                `<div class="city">${e}</div>`
                            );
                        });
                        // click kia list hati
                        document.addEventListener("click", (e) => {
                            if (!e.target.closest(".list") && !e.target.closest("#city")) {
                                document.querySelector(".list").innerHTML = "";
                            }
                        });
                    }


                    //ab list pe click krne pe input pe assign hoke aajay 

                    let cities = document.querySelectorAll(".city");

                    cities.forEach((e) => {
                        e.addEventListener("click", async (event) => {

                            let ci = event.target.closest(".city");
                            document.querySelector(".bar").value = ci.innerText;
                            document.querySelector(".suggestion").remove();
                            /// code to fetch rrest data

                            let finalcity = document.querySelector(".bar").value.split(",")[0].trim();   //taki Prayagraj , India , Uttar Pradesh ese naa aae kewap city aae
                            let lat = 0;
                            let lon = 0;
                            let country = "";
                            let stateName = "";


                            for (let e of data.results) {
                                if (e.name === finalcity) {
                                    lat = e.latitude;
                                    lon = e.longitude;
                                    country = e.country;
                                    stateName = e.admin1;
                                    console.log(lat, lon);
                                    break;
                                }
                            }


                            //   </div>
                            //here we code for our news
                            let key = "1870615b0c2468874bc68b3c80b96900"; //gnews
                            let url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(`"${finalcity}" AND (weather OR rainfall OR flood OR heatwave OR storm OR rain)`)}&lang=en&country=in&max=10&apikey=${key}`;
                            try {
                                let res = await fetch(url);
                                let data = await res.json();

                                for (let x of data.articles) {
                                    let t = x.title;
                                    let desc = x.description;
                                    let date = x.publishedAt;
                                    let source = x.source.name;

                                    document.querySelector(".news").insertAdjacentHTML("beforeend", `
            <div class="articles">
                <div class="title n">${t}</div>
                <div class="des n">${desc}</div>
                <div class="source-date n">
                    Source : ${source} , Published on : ${date}
                </div>
            </div>
        `);
                                }
                            }
                            catch (e) {
                                console.log(e);
                            }

                            ///

                            document.querySelector(".country").innerText = stateName + ` , ` + country

                            //ab yaha se data nikal sakte hain

                            let url1 = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;



                            let weather = {
                                0: "Clear sky ☀️",
                                1: "Mainly clear 🌤️",
                                2: "Partly cloudy ⛅",
                                3: "Overcast ☁️",
                                45: "Fog 🌫️",
                                48: "Fog 🌫️",
                                51: "Drizzle 🌦️",
                                53: "Drizzle 🌦️",
                                55: "Drizzle 🌦️",
                                56: "Freezing drizzle 🌧️",
                                57: "Freezing drizzle 🌧️",
                                61: "Rain 🌧️",
                                63: "Rain 🌧️",
                                65: "Heavy rain 🌧️",
                                66: "Freezing rain 🌧️",
                                67: "Freezing rain 🌧️",
                                71: "Snow ❄️",
                                73: "Snow ❄️",
                                75: "Heavy snow ❄️",
                                77: "Snow grains 🌨️",
                                80: "Rain showers 🌦️",
                                81: "Rain showers 🌧️",
                                82: "Heavy rain showers 🌧️",
                                85: "Snow showers 🌨️",
                                86: "Heavy snow showers 🌨️",
                                95: "Thunderstorm ⛈️",
                                96: "Thunderstorm with hail ⛈️",
                                99: "Thunderstorm with heavy hail ⛈️"
                            };


                            try {
                                let name = finalcity;

                                let res1 = await fetch(url1);
                                let data1 = await res1.json();
                                let temp = data1.current.temperature_2m;
                                let feels = data1.current.apparent_temperature;
                                let humidity = data1.current.relative_humidity_2m;
                                let wind = data1.current.wind_speed_10m;
                                let state = data1.current.weather_code;
                                let w = weather[state];

                                document.querySelector(".name").innerText = name;
                                document.querySelector(".temp").innerText = temp + `℃`;
                                document.querySelector(".app").innerText = `Feels like ` + feels + `℃`;
                                document.querySelector(".hum").innerText = `Humidity : ` + humidity + `%`;
                                document.querySelector(".wind").innerText = `Wind : ` + wind + `km/h`

                                // document.querySelector(".aqi").innerText=wind;
                                document.querySelector(".state").innerText = w;

                                //changing image
                                let time = data1.current.time;
                                let hour = Number(time.split("T")[1].split(":")[0]);



                                console.log(time);
                                console.log(hour);

                                if (hour >= 6 && hour < 18) {
                                    document.querySelector("#sky").src = "sun.svg";
                                }
                                else {
                                    document.querySelector("#sky").src = "moon.svg";
                                }
                                ////// applying rotation in js
                                let sky = document.querySelector("#sky");

                                sky.style.transition = "transform 4s ease-in-out";
                                sky.style.transform = "rotate(360deg)";

                                setTimeout(() => {
                                    sky.style.transition = "none";
                                    sky.style.transform = "rotate(0deg)";
                                }, 800);
                            }
                            catch (err) {

                            }

                            //AQI
                            let url2 = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,ozone&timezone=auto`;
                            try {
                                let res2 = await fetch(url2);

                                if (!res2.ok) throw new Error("AQI API failed");

                                let data2 = await res2.json();

                                let aqi = data2.current.us_aqi;
                                document.querySelector(".aqi").innerText = `AQI : ` + aqi;

                                let box = document.querySelector(".aqi");



                                if (aqi <= 50) {
                                    box.style.color = "green";
                                }
                                else if (aqi <= 100) {
                                    box.style.color = "#D4A017";
                                }
                                else if (aqi <= 150) {
                                    box.style.color = "orange";
                                }
                                else {
                                    box.style.color = "red";
                                }






                            }
                            catch (err) {
                                console.log(err.message);
                            }







                        })
                    })



                }
                catch (err) {
                    console.log(err.message);
                }
            })



        })
