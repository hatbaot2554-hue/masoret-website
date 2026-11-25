export const MAX_ATTACHMENT_BYTES = 2 * 1024 * 1024;

export function fileToAttachment(file) {
  if (!file) return Promise.resolve(null);
  if (!['image/png', 'image/jpeg'].includes(file.type)) {
    return Promise.reject(new Error('יש לבחור תמונת PNG או JPEG. קובצי PDF וקבצים וקטוריים אינם נתמכים כרגע.'));
  }
  if (file.size > MAX_ATTACHMENT_BYTES) {
    return Promise.reject(new Error('קובץ ההטבעה גדול מדי. יש לבחור קובץ בגודל עד 2MB.'));
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string' || !reader.result.startsWith('data:')) {
        reject(new Error('לא ניתן לקרוא את קובץ ההטבעה. יש לבחור אותו מחדש.'));
        return;
      }
      resolve({ name: file.name, type: file.type, size: file.size, dataUrl: reader.result });
    };
    reader.onerror = reader.onabort = () => reject(new Error('קריאת קובץ ההטבעה נכשלה. יש לבחור אותו מחדש.'));
    reader.readAsDataURL(file);
  });
}
