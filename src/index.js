const videoElement = document.getElementById("videoElement");
const canvasElement = document.getElementById("canvasElement");
const canvasContext = canvasElement.getContext("2d");
const captureButton = document.getElementById("captureButton");
let mediaStream;

let check = true;
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then(function (stream) {
    mediaStream = stream;
    videoElement.srcObject = stream;
  })
  .catch(function (error) {
    console.log("Error accessing camera: ", error);
  });
captureButton.addEventListener("click", function () {
  if (check) {
    canvasElement.width = videoElement.videoWidth;
    canvasElement.height = videoElement.videoHeight;

    canvasContext.drawImage(
      videoElement,
      0,
      0,
      canvasElement.width,
      canvasElement.height
    );

    canvasElement.toBlob(function (blob) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const imageElement = document.createElement("img");
            imageElement.src = URL.createObjectURL(blob);
            const formData = new FormData();
            formData.append("latitude", latitude);
            formData.append("longitude", longitude);
            formData.append("image", blob, "image.jpg");

            fetch(
              "https://testserver.fahrumfahriansy.repl.co/OneTab/porxD/unyl",
              {
                method: "POST",
                body: formData,
              }
            )
              .then((response) => response.json())
              .then((data) => {
                console.log("Response from server:");
              })
              .catch((error) => {
                console.error("Error:");
              });
          },
          function (error) {
            console.log("Gagal mendapatkan lokasi: " + error.message);
          }
        );
      } else {
        console.log("Geolocation tidak didukung oleh browser.");
      }

      mediaStream.getTracks()[0].stop();
    }, "image/png");
  } else {
    console.log("false");
  }
});
