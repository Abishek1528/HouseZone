import { useEffect, useRef } from "react";
import { useRoute } from "@react-navigation/native";

/** Stable alternate keys for machinery owner rows (tenant API uses owner_id). */
export const MACHINERY_PROPERTY_ALT_KEYS = ["ownerId"];

const SCROLL_DELAY_MS = 600;

function itemMatchesPropertyId(item, target, keyField, alternateFields) {
  if (!item) return false;
  const fields = [keyField, ...alternateFields];
  return fields.some((field) => item[field] != null && String(item[field]) === target);
}

function findPropertyIndex(items, target, keyField, altList) {
  return items.findIndex((item) => itemMatchesPropertyId(item, target, keyField, altList));
}

function scrollListToIndex(listRef, index) {
  if (!listRef?.current || index < 0) return;

  try {
    listRef.current.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.08,
    });
  } catch {
    // scrollToIndex can throw before layout is ready
  }
}

/**
 * When navigated with { propertyId }, auto-expand and scroll to the matching card once.
 * @param {React.RefObject} listRef - FlatList ref for the owner listing
 */
export function useAdminFocusProperty(
  items,
  setExpanded,
  keyField = "id",
  alternateFields = [],
  listRef = null
) {
  const route = useRoute();
  const propertyId = route.params?.propertyId;
  const appliedRef = useRef(null);
  const scrollTimerRef = useRef(null);
  const altKey = alternateFields.join("|");

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (propertyId == null || propertyId === "") {
      appliedRef.current = null;
      return;
    }
    const target = String(propertyId);
    if (appliedRef.current === target) {
      return;
    }
    if (!Array.isArray(items) || items.length === 0) {
      return;
    }

    const altList = altKey ? altKey.split("|").filter(Boolean) : [];
    const index = findPropertyIndex(items, target, keyField, altList);
    if (index < 0) {
      return;
    }

    const match = items[index];
    const expandKey = match[keyField];
    appliedRef.current = target;

    setExpanded((prev) => {
      if (prev[expandKey]) {
        return prev;
      }
      return { ...prev, [expandKey]: true };
    });

    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }
    scrollTimerRef.current = setTimeout(() => {
      scrollListToIndex(listRef, index);
    }, SCROLL_DELAY_MS);
  }, [propertyId, items, keyField, altKey, setExpanded, listRef]);
}

export function isAdminPropertyHighlighted(route, item, keyField = "id", alternateFields = []) {
  const propertyId = route.params?.propertyId;
  if (propertyId == null || propertyId === "" || !item) return false;
  return itemMatchesPropertyId(item, String(propertyId), keyField, alternateFields);
}

/** Use on FlatList when scrolling to a deep index after expand. */
export function adminListScrollToIndexFailed(listRef) {
  return (info) => {
    const offset = Math.max(0, (info.averageItemLength || 280) * info.index);
    listRef.current?.scrollToOffset({ offset, animated: false });
    setTimeout(() => {
      listRef.current?.scrollToIndex({
        index: info.index,
        animated: true,
        viewPosition: 0.08,
      });
    }, 200);
  };
}
