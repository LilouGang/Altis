import { addAscension, updateAscension, saveMarkerColor } from '../data/sommets.service';
import { Ascension } from '../../../shared/types';

export const submitAscensionData = async (
  isUpdate: boolean, 
  ascensionId: string | null, 
  data: Omit<Ascension, 'id'>
) => {
  if (isUpdate && ascensionId) {
    await updateAscension(ascensionId, data);
    return ascensionId;
  } else {
    const newId = await addAscension(data);
    return newId;
  }
};

export const updateMarkerColor = async (userId: string, summitId: string, color: string) => {
  await saveMarkerColor(userId, summitId, color);
};