import { StyleSheet } from "react-native";
import { OWNER_COLORS, getOwnerFormThemeColors } from "./ownerFormStyles";

export { OWNER_COLORS as TENANT_COLORS };

const C = OWNER_COLORS;

/** Static list / filter styles (light mode base) */
export const tenantListStyles = StyleSheet.create({
  pageHeader: {
    backgroundColor: C.headerBg,
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    marginBottom: 12,
    width: "100%",
  },
  pageHeaderTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -0.4,
  },
  pageHeaderSubtitle: {
    fontSize: 13,
    color: "#cbd5e1",
    marginTop: 4,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 4,
    width: "100%",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: C.headerBg,
    flex: 1,
  },
  filterBtn: {
    backgroundColor: C.accent,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  filterBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
  },
  filterPanel: {
    width: "100%",
    backgroundColor: C.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#dbeafe",
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 14,
    shadowColor: "#0f213d",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  filterPanelTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: C.headerBg,
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  filterSection: {
    width: "100%",
  },
  filterSectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: C.accent,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  filterDivider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 14,
    width: "100%",
  },
  /** @deprecated use filterPanel — kept for imports */
  filterContainer: {
    width: "100%",
    marginBottom: 12,
  },
  filterBox: {
    width: "100%",
    marginBottom: 0,
  },
  selectedFiltersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
    width: "100%",
  },
  selectedFilterBox: {
    backgroundColor: C.primaryLight,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  selectedFilterContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedFilterText: {
    fontSize: 13,
    color: C.accent,
    fontWeight: "600",
    marginRight: 8,
  },
  removeFilterButton: {
    backgroundColor: C.accent,
    borderRadius: 12,
    width: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  removeFilterText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "800",
  },
  list: {
    flex: 1,
    width: "100%",
  },
  card: {
    flexDirection: "row",
    backgroundColor: C.white,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#dbeafe",
    borderRadius: 18,
    shadowColor: "#0f213d",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  imagePlaceholder: {
    width: 110,
    height: 110,
    backgroundColor: C.primaryMuted,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    borderRadius: 14,
    overflow: "hidden",
  },
  imageText: {
    color: C.subText,
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  location: {
    fontSize: 16,
    fontWeight: "800",
    color: C.headerBg,
    marginBottom: 6,
  },
  propertyInfo: {
    padding: 10,
    backgroundColor: C.primaryMuted,
    borderRadius: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: C.subText,
    marginBottom: 4,
  },
  bedroomsText: {
    fontSize: 14,
    fontWeight: "800",
    color: C.accent,
    marginBottom: 4,
  },
  rentText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#059669",
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#dbeafe",
  },
  viewMoreText: {
    color: C.primary,
    fontSize: 14,
    fontWeight: "800",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 14,
    color: C.subText,
    marginTop: 24,
    fontWeight: "600",
  },
  noPropertiesText: {
    textAlign: "center",
    fontSize: 14,
    color: C.subText,
    marginTop: 24,
    fontWeight: "600",
  },
});

/** Machinery-specific list extras */
export const tenantMachineryListStyles = StyleSheet.create({
  imageContainer: {
    width: 110,
    height: 110,
    backgroundColor: C.primaryMuted,
    marginRight: 12,
    borderRadius: 14,
    overflow: "hidden",
  },
  propertyImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: C.primaryMuted,
  },
  areaText: {
    fontSize: 16,
    fontWeight: "800",
    color: C.headerBg,
    marginBottom: 4,
  },
  machineryInfo: {
    backgroundColor: C.primaryMuted,
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
  },
  typeText: {
    fontSize: 14,
    fontWeight: "800",
    color: C.primary,
    marginBottom: 2,
  },
  modelText: {
    fontSize: 13,
    color: C.subText,
    marginBottom: 4,
  },
  rentText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#059669",
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#dbeafe",
    paddingTop: 6,
  },
  viewMoreButton: {
    marginTop: 4,
  },
  viewMoreText: {
    color: C.primary,
    fontSize: 14,
    fontWeight: "800",
  },
  loadingText: tenantListStyles.loadingText,
  noPropertiesText: tenantListStyles.noPropertiesText,
  list: tenantListStyles.list,
  card: tenantListStyles.card,
  detailsContainer: tenantListStyles.detailsContainer,
  imageText: tenantListStyles.imageText,
});

/** Property / listing detail sections */
export const tenantDetailsStyles = StyleSheet.create({
  scrollContainer: {
    width: "100%",
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: C.subText,
    marginTop: 30,
    fontWeight: "600",
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    color: C.subText,
    marginTop: 30,
    fontWeight: "600",
  },
  section: {
    backgroundColor: C.white,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#dbeafe",
    borderRadius: 18,
    width: "100%",
    shadowColor: "#0f213d",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: C.headerBg,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: C.headerBg,
    textAlign: "center",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  firstDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: C.border,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  label: {
    fontSize: 14,
    color: C.subText,
    fontWeight: "700",
    flex: 1.2,
  },
  value: {
    fontSize: 14,
    color: C.text,
    flex: 1,
    textAlign: "right",
    fontWeight: "600",
    paddingLeft: 10,
  },
  conditionRow: {
    marginBottom: 8,
    paddingVertical: 6,
  },
  conditionText: {
    fontSize: 14,
    color: C.text,
    fontWeight: "500",
    textAlign: "left",
    lineHeight: 22,
  },
  imageThumb: {
    width: 200,
    height: 140,
    borderRadius: 14,
    overflow: "hidden",
    marginRight: 10,
    backgroundColor: C.primaryMuted,
  },
  imageBadge: {
    position: "absolute",
    zIndex: 1,
    backgroundColor: "rgba(15,33,61,0.75)",
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderBottomRightRadius: 10,
    fontSize: 11,
    fontWeight: "700",
  },
});

/** Machinery details page */
export const tenantMachineryDetailsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.pageBg,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: C.pageBg,
    padding: 24,
  },
  centeredText: {
    fontSize: 16,
    color: C.subText,
    fontWeight: "600",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 16,
    color: C.headerBg,
    textAlign: "center",
  },
  imageScrollView: {
    marginBottom: 16,
  },
  image: {
    width: 280,
    height: 180,
    borderRadius: 16,
    marginRight: 12,
  },
  section: tenantDetailsStyles.section,
  sectionTitle: tenantDetailsStyles.sectionTitle,
  detailText: {
    fontSize: 15,
    color: C.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  detailLabel: {
    fontWeight: "800",
    color: C.accent,
  },
});

/** Vehicle details */
export const tenantVehicleDetailsStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: C.pageBg,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 20,
  },
  detailsContainer: {
    padding: 16,
  },
  vehicleName: {
    fontSize: 22,
    fontWeight: "900",
    color: C.headerBg,
    marginBottom: 6,
  },
  location: {
    fontSize: 14,
    color: C.subText,
    marginBottom: 16,
    fontWeight: "500",
  },
  infoBox: {
    borderWidth: 1,
    borderColor: "#dbeafe",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    backgroundColor: C.white,
    shadowColor: "#0f213d",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  boxTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: C.headerBg,
    marginBottom: 12,
    textAlign: "center",
    borderBottomWidth: 2,
    borderBottomColor: C.headerBg,
    paddingBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: C.subText,
    fontWeight: "700",
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: C.text,
    fontWeight: "700",
    flex: 1,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: C.pageBg,
  },
});

/**
 * Themed tenant page styles (list, details, forms, buttons).
 * Aligns with owner form palette (#0f213d header, #e7f0ff page).
 */
export const getTenantPageStyles = (dark = false) => {
  const theme = getOwnerFormThemeColors(dark);
  const screenBg = dark ? "#111827" : C.pageBg;
  const cardBg = theme.card;
  const border = theme.border;
  const primary = C.primary;
  const accent = C.accent;

  return {
    theme,
    colors: {
      primary,
      text: theme.text,
      subText: theme.subText,
      card: cardBg,
      border,
      placeholder: theme.placeholder,
      screenBg,
      accent,
      headerBg: C.headerBg,
    },
    screen: { flex: 1, backgroundColor: screenBg },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 16,
    },
    pageHeader: [tenantListStyles.pageHeader, { backgroundColor: C.headerBg }],
    pageHeaderTitle: tenantListStyles.pageHeaderTitle,
    pageHeaderSubtitle: tenantListStyles.pageHeaderSubtitle,
    content: tenantListStyles.content,
    pageTitle: [tenantListStyles.pageTitle, { color: dark ? "#f3f4f6" : C.headerBg }],
    filterBtn: [tenantListStyles.filterBtn, { backgroundColor: C.accent }],
    filterBtnText: tenantListStyles.filterBtnText,
    card: [
      tenantListStyles.card,
      {
        backgroundColor: cardBg,
        borderColor: dark ? "#374151" : "#dbeafe",
      },
    ],
    propertyInfo: [
      tenantListStyles.propertyInfo,
      { backgroundColor: dark ? "#1e3a5f" : C.primaryMuted },
    ],
    section: [
      tenantDetailsStyles.section,
      {
        backgroundColor: cardBg,
        borderColor: dark ? "#374151" : "#dbeafe",
      },
    ],
    sectionTitle: [
      tenantDetailsStyles.sectionTitle,
      { color: dark ? "#f3f4f6" : C.headerBg, borderBottomColor: C.headerBg },
    ],
    label: [tenantDetailsStyles.label, { color: theme.subText }],
    value: [tenantDetailsStyles.value, { color: theme.text }],
    detailRow: [tenantDetailsStyles.detailRow, { borderBottomColor: border }],
    firstDetailRow: [
      tenantDetailsStyles.firstDetailRow,
      { borderTopColor: border, borderBottomColor: border },
    ],
    conditionText: [tenantDetailsStyles.conditionText, { color: theme.text }],
    loadingText: [tenantListStyles.loadingText, { color: theme.subText }],
    bottomBar: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 12,
      width: "100%",
      gap: 10,
    },
    btnPrimary: {
      flex: 1,
      backgroundColor: C.accent,
      paddingVertical: 12,
      borderRadius: 14,
      alignItems: "center",
    },
    btnPrimaryText: {
      color: "#fff",
      fontWeight: "700",
      fontSize: 14,
    },
    btnOutline: {
      flex: 1,
      backgroundColor: dark ? "#374151" : C.white,
      paddingVertical: 12,
      borderRadius: 14,
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: dark ? "#4b5563" : "#94a3b8",
    },
    btnText: {
      color: "#fff",
      fontWeight: "700",
      fontSize: 14,
    },
    btnOutlineText: {
      color: dark ? "#e5e7eb" : "#64748b",
      fontWeight: "700",
      fontSize: 14,
    },
    input: {
      height: 48,
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 14,
      marginBottom: 12,
      width: "100%",
      fontSize: 15,
      backgroundColor: dark ? "#374151" : "#f8fbff",
      color: theme.text,
      borderColor: border,
    },
    fieldLabel: {
      fontSize: 14,
      fontWeight: "700",
      marginBottom: 6,
      color: theme.text,
    },
  };
};

export default {
  tenantListStyles,
  tenantMachineryListStyles,
  tenantDetailsStyles,
  tenantMachineryDetailsStyles,
  tenantVehicleDetailsStyles,
  getTenantPageStyles,
};
