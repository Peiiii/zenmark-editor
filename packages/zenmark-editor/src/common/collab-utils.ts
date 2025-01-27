import { nanoid } from "nanoid";
import { WebrtcProvider } from "y-webrtc";
import { history } from "./history";
function hashCode(str) {
    var hash = 0,
    i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}
const getResourceId = (currentUser) => {
    const path = (history.location.query as any).path;
    if (!path) return;
    if (!currentUser) return;
    return hashCode(`${currentUser}:${path}`).toString()+hashCode(`${path}`).toString();
}
const makeCollabDocId = () => {
    const currentUser = localStorage.getItem("username") || nanoid();
    const resourseId= getResourceId(currentUser);
    return resourseId || nanoid();
}
// export const getCollabDocId = () => (history.location.query as any).collabDocId;
export const getCollabDocId = () => (history.location.query as any).collabDocId;
export const getCollabUrl =()=>{
    return `${location.protocol}://${location.hostname}:${location.port}${location.pathname}?collabDocId=${getCollabDocId()}`;
}
export const buildWebrtcProvider = (ydoc) => {

    let docId = getCollabDocId();
    if (!docId) {
        docId = makeCollabDocId();
        // console.log(`docId: `+docId);
        history.location.query["collabDocId"] = docId;
    }
    console.log("?collabDocId=" + docId);
    return new WebrtcProvider(docId, ydoc);
}


const colors = ['#958DF1', '#F98181', '#FBBC88', '#FAF594', '#70CFF8', '#94FADB', '#B9F18D']
const names = [
    'Lea Thompson',
    'Cyndi Lauper',
    'Tom Cruise',
    'Madonna',
    'Jerry Hall',
    'Joan Collins',
    'Winona Ryder',
    'Christina Applegate',
    'Alyssa Milano',
    'Molly Ringwald',
    'Ally Sheedy',
    'Debbie Harry',
    'Olivia Newton-John',
    'Elton John',
    'Michael J. Fox',
    'Axl Rose',
    'Emilio Estevez',
    'Ralph Macchio',
    'Rob Lowe',
    'Jennifer Grey',
    'Mickey Rourke',
    'John Cusack',
    'Matthew Broderick',
    'Justine Bateman',
    'Lisa Bonet',
]

const getRandomElement = list => list[Math.floor(Math.random() * list.length)]
const getRandomColor = () => getRandomElement(colors)
const getRandomName = () => getRandomElement(names)

export const getInitialUser = () => {
    return JSON.parse(localStorage.getItem('currentUser')!) || {
        name: getRandomName(),
        color: getRandomColor(),
    }
}