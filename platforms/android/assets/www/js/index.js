"use strict";



var gTeamInfo = new Map();

var teamScores = [];




if (document.deviceready) {
    document.addEventListener('deviceready', onDeviceReady, false);
} else {
    document.addEventListener('DOMContentLoaded', onDeviceReady, false);
}

let pages = []; // used to store all our screens/pages
let links = []; // used to store all our navigation links

function onDeviceReady() {
// 
    let refreshBtn = document.querySelectorAll('.refresh');
//    console.dir(refreshBtn);
//    refreshBtn.forEach(function(vv){
//        vv.addEventListener("click", onRefreshData);
//    });
//    
    refreshBtn[0].addEventListener("click", onRefreshData);
    refreshBtn[1].addEventListener("click", onRefreshData);
        
    
    
    pages = document.querySelectorAll('[data-role="page"]');

    links = document.querySelectorAll('[data-role="nav"] a');

    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener("click", navigate);
    }
    
    // create some fake data so you can see how to use a table
    //StandingsData();

    serverData.getJSON();
    
}

function navigate(ev) {
    ev.preventDefault();

    let link = ev.currentTarget;
    console.log(link);
    // split a string into an array of substrings using # as the seperator
    let id = link.href.split("#")[1]; // get the href page name
    console.log(id);
    //update what is shown in the location bar
    history.replaceState({}, "", link.href);

    for (let i = 0; i < pages.length; i++) {
        if (pages[i].id == id) {
            pages[i].classList.add("active");
        } else {
            pages[i].classList.remove("active");
        }
    }
}




function StandingsData(data) {
    let tbody = document.querySelector("#teamStandings tbody");
    console.dir(data);
    tbody.innerHTML = "";
    console.error("Scores: " + data.scores.length)
    data.scores.forEach(function (value, index) {
        console.error("Games: " + value.games.length)
        value.games.forEach(function (v, i) {

            
            console.log(v);
            if (v.home_score > v.away_score) {
               
                teamScores[v.home].win += 1;
                teamScores[v.away].lose += 1;  

            } else if (v.home_score < v.away_score) {
               
                teamScores[v.home].lose += 1;
                teamScores[v.away].win += 1;

            } else {
               
                teamScores[v.home].tie += 1;
                teamScores[v.away].tie += 1;
            }


        });

    });

    teamScores.sort(function (a, b) {
        if (a.win < b.win) {
            return 1;
        }
        if (a.win > b.win) {
            return -1;
        }
        // a must be equal to b
        return 0;
    });


    for (var i in teamScores) {


        console.log(teamScores);
        let tr = document.createElement("tr")
        let tdn = document.createElement("td");
       // tdn.textContent = teamScores[i].name;
        tdn.innerHTML = "<img  src=img/"+teamScores[i].teamlog+" >" +teamScores[i].name;
        let tdw = document.createElement("td");
        tdw.textContent = teamScores[i].win;
        let tdl = document.createElement("td");
        tdl.textContent = teamScores[i].lose;
        let tdt = document.createElement("td");
        tdt.textContent = teamScores[i].tie;


        tr.appendChild(tdn);
        tr.appendChild(tdw);
        tr.appendChild(tdl);
        tr.appendChild(tdt);
        tbody.appendChild(tr);
    }
}






let serverData = {
    url: "https://griffis.edumedia.ca/mad9014/sports/quidditch.php",
    httpRequest: "GET",
    getJSON: function () {

        // Add headers and options objects
        // Create an empty Request Headers instance
        let headers = new Headers();

        // Add a header(s)
        // key value pairs sent to the server

        headers.append("Content-Type", "text/plain");
        headers.append("Accept", "application/json; charset=utf-8");

        // simply show them in the console
        console.dir("headers: " + headers.get("Content-Type"));
        console.dir("headers: " + headers.get("Accept"));

        // Now the best way to get this data all together is to use an options object:

        // Create an options object
        let options = {
            method: serverData.httpRequest,
            mode: "cors",
            headers: headers
        };

        // Create an request object so everything we need is in one package
        let request = new Request(serverData.url, options);
        console.log(request);

        fetch(request)
            .then(function (response) {

                console.log(response);
                return response.json();
            })
            .then(function (data) {
                console.log(data); // now we have JS data, let's display it

                // Call a function that uses the data we recieved  
                displayData(data);
            })
            .catch(function (err) {
                alert("Error: " + err.message);
            });
    }
};

function displayData(data) {
    console.dir(data);

    teamScores = [];
    data.teams.forEach(function (value) {
        
        teamScores[value.id] = {
            name: value.name,
            win: 0,
            lose: 0,
            tie: 0,
            teamlog:value.name+".png"
        };

    });

    console.log(data);

    localStorage.setItem("score", JSON.stringify(data));
    //    var myScoreData = JSON.parse(localStorage.getItem("scores"));
    //    console.log("from LS: ");
    //    console.log(myScoreData);
    //  
    console.log(data.teams);
    console.log(data.scores);

    let ul = document.querySelector(".results-list");
    ul.innerHTML = "";

    data.scores.forEach(function (value) {

        let li = document.createElement("li");
        li.className = "score";

        let h3 = document.createElement("h3");
        h3.textContent = value.date;

        let homeTeam = null;
        let awayTeam = null;

        ul.appendChild(li);
        ul.appendChild(h3);

        value.games.forEach(function (item) {


            homeTeam = getTeamName(data.teams, item.home);
            awayTeam = getTeamName(data.teams, item.away);

            let dg = document.createElement("div");

            let home = document.createElement("div");

            home.innerHTML = homeTeam + " " + "<b>" + item.home_score + "</b>" + "&nbsp" + "<br>";
            home.style.backgroundColor = "#C4EDFF";

            let away = document.createElement("div");

            away.innerHTML = "&nbsp" + awayTeam + " " + "<b>" + item.away_score + "</b>" + "&nbsp";
            away.style.backgroundColor = "#C4EDd4";

            dg.appendChild(home);
            dg.appendChild(away);
            ul.appendChild(dg);
        });
    });
    StandingsData(data);

}

function getTeamName(teams, id) {
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].id == id) {
            return teams[i].name;
        }
    }
    return "unknown";
}

function onRefreshData() {
    
    let myTable = document.querySelector("#teamStandings");
    let rowCount = myTable.rows.length;
    console.error(rowCount);
    for (let i = 1; i < rowCount; i++) {
        console.log("deleted row: " + i);
        myTable.deleteRow(1);
    }
    
    
    serverData.getJSON();
}

