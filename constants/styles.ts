// constants/styles.ts
//
// Single source of truth for every StyleSheet in the app.
// All screens and components import their styles from here instead of
// declaring local `StyleSheet.create(...)` blocks.

import { StyleSheet } from "react-native";

import { C } from "./theme";

/* ─────────────────────────────────────────────────────────────
   App (app/App.tsx)
   ───────────────────────────────────────────────────────────── */
export const AppStyles = StyleSheet.create({
  menuBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  profileBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  profileBtnImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  menuTitle: {
    fontSize: 19,
    fontWeight: "900",
    marginLeft: 8,
    letterSpacing: 0.5,
    flex: 1,
  },
  settingsBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  menuSheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1,
    padding: 22,
    paddingBottom: 36,
  },
  menuHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  menuHdr: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  menuItemIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  menuItemTxt: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
  },

  profileAvatarWrap: {
    alignItems: "center",
    marginBottom: 12,
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  profileAvatarImg: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  profileAvatarBadge: {
    position: "absolute",
    bottom: 0,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 2,
  },
  profileJoin: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 20,
  },
  profileStatsRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 16,
  },
  profileStat: {
    flex: 1,
    alignItems: "center",
  },
  profileStatNum: {
    fontSize: 18,
    fontWeight: "800",
  },
  profileStatLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 2,
  },
  profileStatDiv: {
    width: 1,
    height: 32,
  },

  settingsSheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1,
    padding: 22,
    paddingBottom: 36,
  },
  settingsHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 18,
  },
  settingsTitle: {
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 18,
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
  },
  settingsLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  settingsDivider: {
    height: 1,
    marginVertical: 4,
  },
  settingsAboutRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  settingsAbout: {
    fontSize: 14,
    fontWeight: "700",
  },
  settingsVersion: {
    fontSize: 12,
    marginTop: 2,
  },
  settingsDesc: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: 6,
  },
});

/* ─────────────────────────────────────────────────────────────
   Today Screen (app/screens/TodayScreen.tsx) — style key `s`
   ───────────────────────────────────────────────────────────── */
export const TodayScreenStyles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 4,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.4,
    marginBottom: 2,
  },
  wave: {
    fontSize: 24,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  summary: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 8,
  },
  summaryTxt: {
    fontSize: 12,
    fontWeight: "700",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 80,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 16,
  },
  emptySub: { fontSize: 13, marginTop: 6 },
  list: { paddingHorizontal: 18, paddingBottom: 100 },
  card: {
    borderRadius: 14,
    padding: 13,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardDone: {
    backgroundColor: "#EEF8F0",
    borderColor: "#C8E6C9",
  },
  cardDoneDark: {
    backgroundColor: "#1A3020",
    borderColor: "#2D6A4F",
  },
  accent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderRadius: 3,
  },
  checkbox: { marginLeft: 8, marginRight: 10, marginTop: 1 },
  cardBody: { flex: 1 },
  noteBtn: { padding: 10, justifyContent: "center", alignItems: "center" },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 21,
  },
  cardTitleDone: { textDecorationLine: "line-through", color: "#6B9B78" },
  cardDesc: { fontSize: 12, marginTop: 3 },
  cardTime: { fontSize: 11, marginTop: 5 },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  actionSheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1,
    padding: 22,
    paddingBottom: 36,
  },
  actionHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 18,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  actionSub: {
    fontSize: 12,
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionDelete: {},
  actionDeleteTxt: {
    fontSize: 14,
    fontWeight: "700",
  },
  actionUndo: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  actionDone: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  actionDoneTxt: {
    fontSize: 14,
    fontWeight: "700",
    color: C.white,
  },
});

/* ─────────────────────────────────────────────────────────────
   Today Screen — Welcome popup (key `wp`)
   ───────────────────────────────────────────────────────────── */
export const WelcomePopupStyles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  card: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 32,
    marginHorizontal: 30,
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 16,
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  iconWrap: {
    width: 100,
    height: 110,
    marginBottom: 20,
    position: "relative",
    alignItems: "center",
  },
  calendarBody: {
    width: 90,
    height: 100,
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  calendarTop: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
  },
  calendarDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(123,77,255,0.12)",
  },
  calendarDate: {
    fontSize: 36,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 10,
  },
  badge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  sub: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 22,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 14,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  btnTxt: {
    fontSize: 15,
    fontWeight: "700",
  },
});

/* ─────────────────────────────────────────────────────────────
   Today Screen — Priority ring (key `pr`)
   ───────────────────────────────────────────────────────────── */
export const PriorityRingStyles = StyleSheet.create({
  footer: {
    paddingBottom: 8,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 20,
    marginTop: 4,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  heading: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  ringRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  ringCenter: {
    alignItems: "center",
    gap: 2,
  },
  ringFrac: {
    fontSize: 13,
    fontWeight: "800",
  },
  info: {
    flex: 1,
    gap: 4,
  },
  level: {
    fontSize: 15,
    fontWeight: "700",
  },
  msg: {
    fontSize: 12,
    lineHeight: 17,
  },
});

/* ─────────────────────────────────────────────────────────────
   Welcome Screen (app/screens/WelcomeScreen.tsx)
   ───────────────────────────────────────────────────────────── */
export const WelcomeScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
  },
  top: {
    alignItems: "center",
    paddingTop: 80,
  },
  logoWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  illustration: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
    marginTop: 40,
  },
  illoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  illoCircleSm: {
    position: "absolute",
    top: 10,
    right: 50,
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  illoCircleXs: {
    position: "absolute",
    bottom: 20,
    left: 50,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textSection: {
    alignItems: "center",
    marginTop: 20,
  },
  headline: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    lineHeight: 34,
    letterSpacing: -0.4,
  },
  subheading: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 12,
    paddingHorizontal: 10,
  },
  buttons: {
    marginTop: "auto",
    paddingBottom: 50,
    gap: 12,
  },
  primaryBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  primaryBtnTxt: {
    fontSize: 16,
    fontWeight: "700",
  },
  skipBtn: {
    paddingVertical: 10,
    alignItems: "center",
  },
  skipBtnTxt: {
    fontSize: 14,
    fontWeight: "600",
  },
});

/* ─────────────────────────────────────────────────────────────
   Login Screen (app/screens/LoginScreen.tsx)
   ───────────────────────────────────────────────────────────── */
export const LoginScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
  },
  top: {
    alignItems: "center",
    paddingTop: 80,
  },
  logoWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 18,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 6,
  },
  form: {
    marginTop: 36,
    gap: 14,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    padding: 0,
  },
  loginBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 4,
  },
  loginBtnTxt: {
    fontSize: 16,
    fontWeight: "700",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerTxt: {
    fontSize: 11,
    fontWeight: "600",
    marginHorizontal: 12,
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  googleBtnTxt: {
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    marginTop: "auto",
    paddingBottom: 40,
    alignItems: "center",
  },
  link: {
    fontSize: 13,
    fontWeight: "500",
  },
});

/* ─────────────────────────────────────────────────────────────
   Create Account Screen (app/screens/CreateAccountScreen.tsx)
   ───────────────────────────────────────────────────────────── */
export const CreateAccountScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
  },
  top: {
    alignItems: "center",
    paddingTop: 80,
  },
  logoWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    marginTop: 18,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 6,
  },
  form: {
    marginTop: 36,
    gap: 14,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    padding: 0,
  },
  createBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 4,
  },
  createBtnTxt: {
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    marginTop: "auto",
    paddingBottom: 40,
    alignItems: "center",
  },
  link: {
    fontSize: 13,
    fontWeight: "500",
  },
});

/* ─────────────────────────────────────────────────────────────
   Add Task Screen (app/screens/AddTaskScreen.tsx)
   ───────────────────────────────────────────────────────────── */
export const AddTaskScreenStyles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  closeBtn: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: "700" },
  saveTopBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  saveTopTxt: { fontWeight: "700", fontSize: 13 },

  scroll: { padding: 18, paddingBottom: 50 },
  card: {
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
  },
  lbl: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  titleInput: {
    fontSize: 17,
    fontWeight: "600",
    padding: 0,
    lineHeight: 24,
  },
  descInput: { fontSize: 14, padding: 0, height: 68 },

  dayRow: { gap: 8, paddingVertical: 2 },
  dc: {
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 52,
    position: "relative",
  },
  dcTxt: { fontSize: 11, fontWeight: "700" },
  todayDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    position: "absolute",
    top: 5,
    right: 7,
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    borderRadius: 10,
    padding: 11,
    borderWidth: 1,
  },
  timeTxt: { flex: 1, fontSize: 14, fontWeight: "600" },
  timeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 12 },
  ts: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 9,
    borderWidth: 1,
  },
  tsTxt: { fontSize: 11, fontWeight: "600" },

  summary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
  summaryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  summaryTitle: { fontSize: 13, fontWeight: "700" },
  summaryMeta: { fontSize: 11, marginTop: 3 },

  addBtn: {
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
  },
  addBtnTxt: { fontSize: 15, fontWeight: "700" },

  toast: {
    position: "absolute",
    bottom: 30,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 12,
  },
  toastIcon: { marginRight: 12 },
  toastBody: { flex: 1 },
  toastTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  toastSub: {
    fontSize: 11,
    marginTop: 2,
  },
  toastAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginLeft: 8,
  },
  toastActionTxt: {
    fontSize: 11,
    fontWeight: "700",
  },
});

/* ─────────────────────────────────────────────────────────────
   Search Screen (app/screens/SearchScreen.tsx)
   ───────────────────────────────────────────────────────────── */
export const SearchScreenStyles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: { paddingBottom: 100 },
  header: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 8 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.4,
  },

  bar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 18,
    marginBottom: 20,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
  },
  barInput: { flex: 1, fontSize: 14, padding: 0 },

  recentWrap: { paddingHorizontal: 20 },
  recentHdr: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 12,
  },
  recentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: 1,
  },
  recentIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
  recentLabel: { flex: 1, fontSize: 14, fontWeight: "500" },
  recentDivider: {
    height: 1,
    marginVertical: 8,
  },

  doneWrap: { paddingHorizontal: 20, marginTop: 24, paddingBottom: 100 },
  doneHdr: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.4,
    marginBottom: 14,
  },
  doneCard: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#32C671",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  doneCardBody: { flex: 1, marginRight: 10 },
  doneCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 21,
  },
  doneChips: { flexDirection: "row", flexWrap: "wrap", gap: 5, marginTop: 6 },
  doneChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  doneChipTxt: { fontSize: 10, fontWeight: "600" },

  emptyWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 80,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 16,
  },
  emptySub: {
    fontSize: 13,
    marginTop: 6,
    textAlign: "center",
    paddingHorizontal: 40,
  },

  list: { paddingHorizontal: 18, paddingBottom: 100 },
  resultsHdr: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 10,
  },

  card: {
    borderRadius: 14,
    padding: 13,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  cardDone: {
    backgroundColor: "#EEF8F0",
    borderColor: "#C8E6C9",
    shadowColor: "#32C671",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  cardDoneDark: {
    backgroundColor: "#1A3020",
    borderColor: "#2D6A4F",
    shadowColor: "#4ADE80",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  accent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderRadius: 3,
  },
  checkbox: { marginLeft: 8, marginRight: 10, marginTop: 1 },
  cardBody: { flex: 1 },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 21,
  },
  cardTitleDone: { textDecorationLine: "line-through", color: "#6B9B78" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 5, marginTop: 6 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
  },
  chipTxt: { fontSize: 10, fontWeight: "500" },
  chipDone: {},
  chipDoneTxt: { fontSize: 10, fontWeight: "700" },
});

/* ─────────────────────────────────────────────────────────────
   Splash Screen (app/screens/SplashScreen.tsx)
   ───────────────────────────────────────────────────────────── */
export const SplashScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    marginTop: 12,
    letterSpacing: 1,
  },
  cursor: { opacity: 0.7 },
  tagline: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 6,
    opacity: 0.8,
  },
});

/* ─────────────────────────────────────────────────────────────
   Upcoming Screen (app/screens/UpcomingScreen.tsx)
   ───────────────────────────────────────────────────────────── */
export const UpcomingScreenStyles = StyleSheet.create({
  safe: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 8 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.4,
  },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 80,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginTop: 16,
  },
  emptySub: { fontSize: 13, marginTop: 6 },

  list: { paddingHorizontal: 18, paddingTop: 6, paddingBottom: 130 },
  section: { marginBottom: 18 },

  dayRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  dayLine: { flex: 1, height: 1 },
  dayName: {
    fontSize: 10,
    fontWeight: "700",
    paddingHorizontal: 10,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },

  card: {
    borderRadius: 14,
    padding: 13,
    marginBottom: 9,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardDone: {
    backgroundColor: "#EEF8F0",
    borderColor: "#C8E6C9",
  },
  cardDoneDark: {
    backgroundColor: "#1A3020",
    borderColor: "#2D6A4F",
  },
  accent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderRadius: 3,
  },
  checkbox: { marginLeft: 8, marginRight: 10, marginTop: 1 },
  cardBody: { flex: 1 },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 21,
  },
  cardTitleDone: { textDecorationLine: "line-through", color: "#6B9B78" },
  cardDesc: { fontSize: 12, marginTop: 3 },
  cardTime: { fontSize: 11, marginTop: 5 },
  actions: { flexDirection: "row", gap: 2, marginLeft: 6 },
  actBtn: { padding: 6, borderRadius: 8 },

  badgeWrap: {
    position: "absolute",
    bottom: 72,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    shadowColor: "#32C671",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  badgeTxt: { fontSize: 12, fontWeight: "700" },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  sheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 22,
    borderTopWidth: 1,
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 18,
  },
  sheetTitle: {
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 18,
  },

  lbl: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 7,
  },
  mInput: {
    borderWidth: 1,
    borderRadius: 11,
    paddingHorizontal: 13,
    paddingVertical: 11,
    fontSize: 14,
    marginBottom: 14,
  },
  mInputTall: { height: 74, textAlignVertical: "top" },

  dc: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  dcTxt: { fontSize: 12, fontWeight: "700" },
  dcTxtOn: { color: C.white },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    padding: 11,
    borderWidth: 1,
    marginBottom: 4,
  },
  timeTxt: { flex: 1, fontSize: 13, fontWeight: "600" },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
    marginBottom: 10,
  },
  ts: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
  },
  tsTxt: { fontSize: 10, fontWeight: "600" },

  mActions: { flexDirection: "row", gap: 10, marginTop: 14 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  cancelTxt: { fontSize: 14, fontWeight: "700" },
  saveBtn: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  saveTxt: { fontSize: 14, fontWeight: "700" },

  promptOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  promptSheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1,
    padding: 22,
    paddingBottom: 36,
  },
  promptHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 18,
  },
  promptTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  promptSub: {
    fontSize: 12,
    marginBottom: 20,
  },
  promptRow: {
    flexDirection: "row",
    gap: 10,
  },
  promptBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  promptDelete: {},
  promptDeleteTxt: {
    fontSize: 14,
    fontWeight: "700",
  },
  promptUndo: {
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  promptDone: {
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  promptDoneTxt: {
    fontSize: 14,
    fontWeight: "700",
  },
});

/* ─────────────────────────────────────────────────────────────
   Note Modal (components/NoteModal.tsx)
   ───────────────────────────────────────────────────────────── */
export const NoteModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1,
    padding: 22,
    paddingBottom: 36,
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 18,
  },
  title: {
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 2,
  },
  sub: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: "500",
    minHeight: 120,
    lineHeight: 20,
  },
  counter: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "right",
    marginTop: 6,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  cancelTxt: {
    fontSize: 14,
    fontWeight: "700",
  },
  saveBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 13,
    borderRadius: 12,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  saveTxt: {
    fontSize: 14,
    fontWeight: "700",
  },
});

/* ─────────────────────────────────────────────────────────────
   Task Preview Card (components/TaskPreviewCard.tsx)
   ───────────────────────────────────────────────────────────── */
export const TaskPreviewCardStyles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  emoji: {
    fontSize: 24,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
  time: {
    fontSize: 12,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    gap: 6,
    marginLeft: 10,
  },
  iconBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});

/* ─────────────────────────────────────────────────────────────
   Voice Capture Modal (components/VoiceCaptureModal.tsx)
   ───────────────────────────────────────────────────────────── */
export const VoiceCaptureModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  keyboard: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1,
    padding: 22,
    paddingBottom: 40,
    maxHeight: "85%",
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 18,
  },
  content: {
    alignItems: "center",
  },
  micEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  heading: {
    fontSize: 19,
    fontWeight: "800",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 16,
  },
  comingSoon: {
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 2,
    marginBottom: 2,
  },
  inputWrap: {
    width: "100%",
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 4,
    marginBottom: 16,
  },
  input: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
    minHeight: 100,
    maxHeight: 160,
    padding: 12,
  },
  generateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    width: "100%",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  generateBtnTxt: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  btnRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
    width: "100%",
  },
  btn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  btnCancel: {},
  btnCancelTxt: { fontSize: 14, fontWeight: "700" },
  btnSave: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 0,
  },
  btnSaveTxt: { fontSize: 14, fontWeight: "700", color: "#FFFFFF" },
  foundBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  foundTxt: {
    fontSize: 16,
    fontWeight: "700",
  },
  taskList: {
    width: "100%",
    maxHeight: 280,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: "dashed",
    width: "100%",
    marginBottom: 4,
  },
  addBtnTxt: {
    fontSize: 13,
    fontWeight: "600",
  },
  noTasks: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 12,
  },
  noTasksSub: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  retryBtnTxt: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    alignSelf: "flex-start",
  },
  editBtnRow: {
    width: "100%",
    marginTop: 16,
  },
  editBtn: {
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  editBtnDangerTxt: { fontSize: 14, fontWeight: "700" },
  editScroll: {
    width: "100%",
  },
  editScrollContent: {
    alignItems: "center",
  },
  editInput: {
    width: "100%",
    fontSize: 15,
    fontWeight: "500",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  successOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    zIndex: 100,
  },
  successCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  successTxt: {
    fontSize: 18,
    fontWeight: "800",
  },
});

/* ─────────────────────────────────────────────────────────────
   Voice Capture Button (components/VoiceCaptureButton.tsx)
   ───────────────────────────────────────────────────────────── */
export const VoiceCaptureButtonStyles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 90,
    right: 20,
    zIndex: 50,
  },
  button: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
});

/* ─────────────────────────────────────────────────────────────
   Icon Background (components/IconBackground.tsx)
   ───────────────────────────────────────────────────────────── */
export const IconBackgroundStyles = StyleSheet.create({
  root: { flex: 1 },
  icons: { ...StyleSheet.absoluteFillObject },
  circle: {
    position: "absolute",
    borderWidth: 1.5,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  content: { flex: 1 },
});

/* ─────────────────────────────────────────────────────────────
   Themed Text (components/themed-text.tsx)
   ───────────────────────────────────────────────────────────── */
export const ThemedTextStyles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
});

/* ─────────────────────────────────────────────────────────────
   Parallax Scroll View (components/parallax-scroll-view.tsx)
   ───────────────────────────────────────────────────────────── */
export const ParallaxScrollViewStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 250,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: "hidden",
  },
});

/* ─────────────────────────────────────────────────────────────
   Collapsible (components/ui/collapsible.tsx)
   ───────────────────────────────────────────────────────────── */
export const CollapsibleStyles = StyleSheet.create({
  heading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});
