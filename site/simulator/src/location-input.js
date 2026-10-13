export function validateLocation(input, publicData) {
  if (!publicData.prefectures.some(item => item.code === input.prefectureCode)) {
    throw new Error('都道府県を選択してください．');
  }
  return null;
}
