const key =
  "pk.eyJ1Ijoic2FpZm9lbGxvaCIsImEiOiJjam0wZnY4bDEwYWhzM3ByNTZoejAyOTI4In0.lQHwm97ciEN7s-l9qNRLDA"
let points = []
let markers = []
let loadPath = []
let path = {}
let open = []
let close = []

const btnConsole = document.getElementById("check")
const btnReset = document.getElementById("reset")
const mymap = L.map("mapid").setView([51.505, -0.09], 13)
const mapLayer = L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: key,
  },
)
mapLayer.addTo(mymap)

const onMapClick = (e) => {
  points = [...points, { ...e.latlng }]
  const marker = new L.Marker([e.latlng.lat, e.latlng.lng])
  marker.addTo(mymap)
  markers = [...markers, marker]
}

const greedyAlgorithm = (open = [], close = []) => {
  if (open.length - 1 > 0) {
    const start = close[close.length - 1]
    let curDistance = start._latlng.distanceTo(open[0]._latlng)
    let mark = open[0]
    open.map((item, idx) => {
      const temp = start._latlng.distanceTo(item._latlng)
      if (temp < curDistance) {
        console.log(close.length - 1, curDistance, temp)
        curDistance = temp
        mark = item
      }
    })
    const afterClose = [...close, mark]
    const afterOpen = open.filter((item) => !close.includes(item))
    greedyAlgorithm(afterOpen, afterClose)
  } else {
    close = [...close, ...open]
    open = [].slice()
    loadPath = close.map((x) => x._latlng)
    console.log({ open, close, loadPath })
    routing = L.Routing.control({
      wayponts: [...loadPath],
    })
    path = L.polyline(loadPath)
    routing.addTo(mymap)
    path.addTo(mymap)
  }
}
const onBtnClick = async () => {
  const start = markers[0]
  close = [...close, start]
  open = markers.filter((x) => !close.includes(x))
  const result = await greedyAlgorithm(open, close)
  console.log({ open, close, result })
  mymap.fitBounds(L.latLngBounds(points))
}

mymap.on("click", onMapClick)
btnConsole.addEventListener("click", onBtnClick)
btnReset.addEventListener("click", function () {
  open = [].slice()
  close = [].slice()
  loadPath = [].slice()
  mymap.removeLayer(path)
  mymap.removeLayer(loadPath)
  markers.map((m) => mymap.removeLayer(m))
})
