import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { FileText, Image as ImageIcon, Video, File, Upload, Share2 } from 'lucide-react-native';

const DashboardScreen = () => {
  const stats = [
    { title: 'Total', value: '1.2k', color: '#3b82f6' },
    { title: 'Storage', value: '45GB', color: '#10b981' },
    { title: 'Shared', value: '24', color: '#8b5cf6' },
  ];

  const recentAssets = [
    { id: '1', name: 'Confidential_Q3.pdf', type: 'PDF', time: '2h ago' },
    { id: '2', name: 'Launch_Video.mp4', type: 'Video', time: '5h ago' },
    { id: '3', name: 'User_Research.doc', type: 'Doc', time: 'Yesterday' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <Text style={styles.statLabel}>{stat.title}</Text>
            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Assets</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>

      {recentAssets.map((item) => (
        <View key={item.id} style={styles.assetItem}>
          <View style={styles.assetIcon}>
            {item.type === 'PDF' ? <FileText size={20} color="#94a3b8" /> : 
             item.type === 'Video' ? <Video size={20} color="#94a3b8" /> : 
             <File size={20} color="#94a3b8" />}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.assetName}>{item.name}</Text>
            <Text style={styles.assetTime}>{item.time}</Text>
          </View>
          <TouchableOpacity>
            <Share2 size={18} color="#475569" />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.fab}>
        <Upload size={24} color="#fff" />
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    padding: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 15,
    width: '30%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  statLabel: {
    color: '#64748b',
    fontSize: 12,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAll: {
    color: '#0284c7',
    fontSize: 14,
  },
  assetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  assetIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  assetName: {
    color: '#f1f5f9',
    fontSize: 14,
    fontWeight: 'medium',
  },
  assetTime: {
    color: '#64748b',
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 0,
    width: 60,
    height: 60,
    backgroundColor: '#0284c7',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
});

export default DashboardScreen;
