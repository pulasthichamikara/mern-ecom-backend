const bucket = 'shopfiles-78664.appspot.com';
//https://firebasestorage.googleapis.com/v0/b/shopfiles-78664.appspot.com/o/1669984528745-653751080te%20(5).jpg?alt=media&token=0c39a6d4-9062-495a-9e99-a9f445e8773b
export const imageUrl = (name) => {
  const url = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${name}?alt=media`;
  return url;
};
