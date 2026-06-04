import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Platform,
  Dimensions,
  StyleSheet,
} from 'react-native';
import ImageView from 'react-native-image-viewing';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
const API_HOST = API_BASE_URL.replace(/\/api$/, '');

function resolveImageUri(imgRaw) {
  if (!imgRaw || typeof imgRaw !== 'string' || !imgRaw.trim()) return null;
  const trimmed = imgRaw.trim();
  return trimmed.startsWith('http') ? trimmed : `${API_HOST}${trimmed}`;
}

export default function AdminImageGallery({
  images = [],
  thumbnailWidth = 300,
  thumbnailHeight = 200,
  showCounter = true,
}) {
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const screen = Dimensions.get('window');

  const galleryImages = useMemo(() => {
    if (!Array.isArray(images)) return [];
    return images
      .map(resolveImageUri)
      .filter(Boolean)
      .map((uri) => ({ uri }));
  }, [images]);

  if (galleryImages.length === 0) return null;

  const safeIndex = Math.min(currentImageIndex, galleryImages.length - 1);

  const openAt = (index) => {
    setCurrentImageIndex(index);
    setIsImageViewVisible(true);
  };

  return (
    <View style={styles.section}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {galleryImages.map((img, idx) => (
          <TouchableOpacity
            key={`${img.uri}-${idx}`}
            activeOpacity={0.85}
            onPress={() => openAt(idx)}
            style={{ marginRight: 10 }}
          >
            <View
              style={[
                styles.thumbWrap,
                { width: thumbnailWidth, height: thumbnailHeight },
              ]}
            >
              {showCounter && galleryImages.length > 1 && (
                <Text style={styles.badge}>
                  {idx + 1}/{galleryImages.length}
                </Text>
              )}
              <Image
                source={img}
                style={{ width: thumbnailWidth, height: thumbnailHeight }}
                resizeMode="cover"
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {Platform.OS === 'web' ? (
        <Modal
          visible={isImageViewVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsImageViewVisible(false)}
        >
          <View style={styles.backdrop}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setIsImageViewVisible(false)}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
            {galleryImages.length > 1 && safeIndex > 0 && (
              <TouchableOpacity
                style={[styles.navBtn, styles.navLeft]}
                onPress={() => setCurrentImageIndex((i) => Math.max(0, i - 1))}
              >
                <Text style={styles.navText}>‹</Text>
              </TouchableOpacity>
            )}
            {galleryImages.length > 1 && safeIndex < galleryImages.length - 1 && (
              <TouchableOpacity
                style={[styles.navBtn, styles.navRight]}
                onPress={() =>
                  setCurrentImageIndex((i) => Math.min(galleryImages.length - 1, i + 1))
                }
              >
                <Text style={styles.navText}>›</Text>
              </TouchableOpacity>
            )}
            <Image
              source={galleryImages[safeIndex]}
              style={{ width: screen.width, height: screen.height * 0.85 }}
              resizeMode="contain"
            />
            {galleryImages.length > 1 && (
              <Text style={styles.counter}>
                {safeIndex + 1} / {galleryImages.length}
              </Text>
            )}
          </View>
        </Modal>
      ) : (
        <ImageView
          images={galleryImages}
          imageIndex={safeIndex}
          visible={isImageViewVisible}
          onRequestClose={() => setIsImageViewVisible(false)}
          presentationStyle="overFullScreen"
          animationType="fade"
          swipeToCloseEnabled
          doubleTapToZoomEnabled
          backgroundColor="#000000"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 15,
  },
  scroll: {
    marginBottom: 0,
  },
  thumbWrap: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  badge: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomRightRadius: 8,
    fontSize: 12,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 48,
    right: 24,
    zIndex: 10,
    padding: 8,
  },
  closeText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
  },
  navBtn: {
    position: 'absolute',
    top: '50%',
    zIndex: 10,
    padding: 16,
  },
  navLeft: { left: 8 },
  navRight: { right: 8 },
  navText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '300',
  },
  counter: {
    position: 'absolute',
    bottom: 32,
    color: '#fff',
    fontSize: 14,
  },
});
