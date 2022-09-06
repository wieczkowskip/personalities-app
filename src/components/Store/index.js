import { createSlice, configureStore } from "@reduxjs/toolkit";

const redux = require("redux");

const initialState = {
  users: [],
  usersForSummary: [],
  listOfMembers: [],
  signInActive: false,
  showMemberInfo: false,
  showAddUser: false,
  showEditUser: false,
  showDeleteUser: false,
  addedNewUserStatus: false,
  deletedUserStatus: false,
  editUserStatus: false,
  nameOfClickedMember: "",
  strategyOfClickedMember: "",
  animalPhotoOfClickedMember: "",
  groupOfClickedMember: "",
  typeOfClickedMember: "",
  userLoggedIn: false,
  nameOfUserLoggedIn: "",
  animalPhotoOfUserLoggedIn: "",
  typeOfUserLoggedIn: "",
  userId: "",
  session: "",
  selectedTeamLeader: "",
};

const storeSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
    },
    setUsersForSummary(state, action) {
      state.usersForSummary = action.payload;
    },
    showSignInModal(state) {
      state.signInActive = true;
      console.log(state.signInActive);
    },
    closeSignInModal(state) {
      state.signInActive = false;
    },
    showAddUserModal(state) {
      state.showAddUser = true;
    },
    closeAddUserModal(state) {
      state.showAddUser = false;
    },
    setShowDeleteUser(state, action) {
      state.showDeleteUser = action.payload;
    },
    setAddedNewUserStatus(state, action) {
      state.addedNewUserStatus = action.payload;
    },
    setDeletedUserStatus(state, action) {
      state.deletedUserStatus = action.payload;
    },
    setEditUserStatus(state, action) {
      state.editUserStatus = action.payload;
    },
    showEditUserModal(state) {
      state.showEditUser = true;
    },
    closeEditUserModal(state) {
      state.showEditUser = false;
    },
    showDeleteUserModal(state) {
      state.showDeleteUser = true;
    },
    closeDeleteUserModal(state) {
      state.showDeleteUser = false;
    },
    showMemberInfoModal(state) {
      state.showMemberInfo = true;
      console.log(state.showMemberInfo);
    },
    setStrategyOfClickedMember(state, action) {
      state.strategyOfClickedMember = action.payload;
    },
    setNameOfClickedMember(state, action) {
      state.nameOfClickedMember = action.payload;
    },
    setAnimalPhotoOfClickedMember(state, action) {
      state.animalPhotoOfClickedMember = action.payload;
    },
    setGroupOfClickedMember(state, action) {
      state.groupOfClickedMember = action.payload;
    },
    setTypeOfClickedMember(state, action) {
      state.typeOfClickedMember = action.payload;
    },
    closeMemberInfoModal(state) {
      state.showMemberInfo = false;
    },
    setNameOfUserLoggedIn(state, action) {
      state.nameOfUserLoggedIn = action.payload;
    },
    setAnimalPhotoOfUserLoggedIn(state, action) {
      state.animalPhotoOfUserLoggedIn = action.payload;
    },
    setTypeOfUserLoggedIn(state, action) {
      state.typeOfUserLoggedIn = action.payload;
    },
    logOutUser(state) {
      state.nameOfUserLoggedIn = "";
    },
    setSelectedTeamLeader(state, action) {
      state.selectedTeamLeader = action.payload;
    },
  },
});

const store = configureStore({
  reducer: storeSlice.reducer,
});

export const storeActions = storeSlice.actions;

export default store;
