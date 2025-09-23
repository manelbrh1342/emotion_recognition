
export async function predictEmotion(audioFile) {
  const formData = new FormData();
  formData.append("file", audioFile);

  const response = await fetch("https://manelbrh1342-emotion-recognition-app.hf.space/predict", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  return data;
}
