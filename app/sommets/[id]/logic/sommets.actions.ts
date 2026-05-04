import { addAscension, updateAscension, saveMarkerColor } from '../data/sommets.service';
import { SommetCarte } from '../../../principale/logic/principale.selectors';

export const submitAscensionData = async (
  isUpdate: boolean, 
  docId: string, 
  data: SommetCarte
) => {
  if (isUpdate) {
    await updateAscension(docId, data);
    return docId;
  } else {
    const newId = await addAscension(docId, data);
    return newId;
  }
};

export const updateMarkerColor = async (docId: string, color: string) => {
  await saveMarkerColor(docId, color);
};