import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../core/constants/colors';
import { POPPINS } from '../../core/constants/poppins';

type TabDefinition = {
  key: string;
  title: string;
  component?: React.ComponentType<any>;
  render?: () => React.ReactNode;
  children?: React.ReactNode;
  onPress?: () => void;
};

type Props = {
  title?: string;
  tabs: TabDefinition[];
  initialTabKey?: string;
  onTabChange?: (key: string) => void;
};

export function HeaderNavigation({
  title,
  tabs,
  initialTabKey,
  onTabChange,
}: Props) {
  const initialIndex = initialTabKey
    ? tabs.findIndex(t => t.key === initialTabKey)
    : 0;
  const [activeIndex, setActiveIndex] = useState(Math.max(0, initialIndex));

  function handlePress(index: number) {
    const tab = tabs[index];
    setActiveIndex(index);
    tab.onPress && tab.onPress();
    onTabChange && onTabChange(tab.key);
  }

  const ActiveComponent = tabs[activeIndex]?.component;

  return (
    <View style={styles.container}>
      {title ? <Text style={styles.title}>{title}</Text> : null}

      <View style={styles.tabsRow}>
        {tabs.map((tab, i) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => handlePress(i)}
            style={[
              styles.tabButton,
              i !== tabs.length - 1 && { marginRight: 8 },
              activeIndex === i && styles.tabButtonActive,
            ]}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.tabText,
                activeIndex === i && styles.tabTextActive,
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        {ActiveComponent ? (
          <ActiveComponent />
        ) : (
          (typeof tabs[activeIndex]?.render === 'function'
            ? tabs[activeIndex]!.render()
            : tabs[activeIndex]?.children) ?? null
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.white,
    paddingVertical: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: POPPINS.medium,
    textAlign: 'center',
    color: colors.heading,
    marginVertical: 16,
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.border,
    borderBottomWidth: 1,
    justifyContent: 'space-between',
    width: '100%',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primaryLight,
  },
  tabText: {
    fontFamily: POPPINS.regular,
    color: colors.neutral[500],
  },
  tabTextActive: {
    fontFamily: POPPINS.medium,
    color: colors.primaryLight,
  },
  content: {
    marginTop: 12,
  },
});
