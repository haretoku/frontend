import {readProgress,writeProgress} from '../../map/progress-storage.js';
import {initialJourneyState} from '../../map/journey-state.js';

const validPawn=value=>value==='male'||value==='female';

export function readAvatar(host=window){
  const saved=readProgress(host);
  return saved?.pawnChosen===true&&validPawn(saved.pawn)?saved.pawn:initialJourneyState().pawn;
}

export function writeAvatar(pawn,host=window){
  if(!validPawn(pawn))return false;
  // 選択直前の保存内容へ重ね，診断条件や進捗を古い画面の値で戻さない．
  const saved=readProgress(host)??initialJourneyState();
  return writeProgress({...saved,pawn,pawnChosen:true},host);
}
