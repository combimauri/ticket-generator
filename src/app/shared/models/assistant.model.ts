export interface Assistant {
  id: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  deleteFlag: boolean;
  phoneNumber?: string;
  addDate?: Date;
  updateDate?: Date;
  checkIn?: boolean;
  visibleInSearch?: boolean;
  qrSent?: boolean;
}
