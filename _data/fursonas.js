module.exports = async function(){
  try {
    const sonasRes = await fetch('https://cascading.space/.well-known/fursona');

    if (sonasRes.ok) {
      const data = await sonasRes.json();
      const fursonas = data.sonas;

      return fursonas;
    }

  } catch (err) {
    console.error(err);
  }
}