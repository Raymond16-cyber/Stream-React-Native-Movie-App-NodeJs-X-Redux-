export async function generateName () {
  const prefix = "uid-";
  const values = "blq8bcq47vbammckowyqpwp72308JGGgJGJGiykniXwwKCgyt411004183hdbcqiu4q7190021o41KCooTORTVItvwytroi884bv4b";
  let name = prefix;

  for (let i = 0; i < 10; i++) {
    // Add a dash in the middle if you want
    if (i === 5) name += "-";
    const randomIndex = Math.floor(Math.random() * values.length);
    name += values[randomIndex];
  }

  console.log("name:", name);
  return name;
}
   