import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { useThemeStore } from '../../store/themeStore';
import { getTranslations } from '../../services/i18n/translations';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { useReportStore } from '../../store/reportStore';
import { Report } from '../../types';

export const ReportHistoryScreen: React.FC = () => {
    const { myReports } = useReportStore();
    const { theme, language } = useThemeStore();
    const t = getTranslations(language);

    const getStatusColor = (status: Report['status'], theme: any) => {
        switch (status) {
            case 'approved':
                return theme.success || '#10B981';
            case 'rejected':
                return theme.error || '#EF4444';
            case 'under_review':
                return theme.warning || '#F59E0B';
            default:
                return theme.textSecondary || '#999';
        }
    };

    const getSeverityColor = (severity: Report['severity']) => {
        switch (severity) {
            case 'critical':
                return '#DC2626';
            case 'high':
                return '#F97316';
            case 'medium':
                return '#EAB308';
            default:
                return '#22C55E';
        }
    };

    const renderReport = ({ item }: { item: Report }) => (
        <View
            style={[
                styles.reportCard,
                {
                    backgroundColor: theme.cardBg,
                    borderColor: theme.borderColor,
                },
            ]}
        >
            <View style={styles.reportHeader}>
                <View
                    style={[
                        styles.severityBadge,
                        { backgroundColor: getSeverityColor(item.severity) },
                    ]}
                >
                    <Text style={styles.badgeText}>{item.severity.toUpperCase()}</Text>
                </View>
                <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(item.status, theme) },
                    ]}
                >
                    <Text style={styles.badgeText}>{item.status.replace('_', ' ').toUpperCase()}</Text>
                </View>
            </View>

            <Text style={[styles.reportDescription, { color: theme.text }]} numberOfLines={3}>
                {item.description}
            </Text>

            <View style={styles.reportFooter}>
                <Text style={[styles.reportDate, { color: theme.textSecondary }]}>
                    {new Date(item.timestamp).toLocaleDateString()}
                </Text>
                {item.rewardAmount && (
                    <Text style={[styles.reward, { color: theme.success || '#10B981' }]}>
                        +{item.rewardAmount} MATIC
                    </Text>
                )}
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Header title={t.reports.reportHistory} />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={[styles.header, { color: theme.text }]}>
                    {t.reports.reports}
                </Text>

                <View style={styles.statsRow}>
                    <StatCard 
                        label="Total" 
                        value={myReports.length.toString()}
                        theme={theme}
                    />
                    <StatCard
                        label="Approved"
                        value={myReports.filter((r) => r.status === 'approved').length.toString()}
                        theme={theme}
                    />
                    <StatCard
                        label="Pending"
                        value={myReports.filter((r) => r.status === 'pending').length.toString()}
                        theme={theme}
                    />
                </View>

                {myReports.length === 0 ? (
                    <View
                        style={[
                            styles.emptyCard,
                            {
                                backgroundColor: theme.cardBg,
                                borderColor: theme.borderColor,
                            },
                        ]}
                    >
                        <Text style={[styles.emptyText, { color: theme.text }]}>
                            No reports yet
                        </Text>
                        <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
                            Submit your first report to help protect the environment
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={myReports}
                        renderItem={renderReport}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                    />
                )}

                {/* Footer */}
                <Footer companyName="Gourav Kumar Ojha" />
            </ScrollView>
        </View>
    );
};

const StatCard: React.FC<{
    label: string
    value: string
    theme: any
}> = ({ label, value, theme }) => (
    <View
        style={[
            styles.statCard,
            {
                backgroundColor: theme.cardBg,
                borderColor: theme.borderColor,
            },
        ]}
    >
        <Text style={[styles.statValue, { color: theme.primary }]}>{value}</Text>
        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{label}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 20,
    },
    header: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 24,
        letterSpacing: -0.5,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '500',
    },
    reportCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
    },
    reportHeader: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    severityBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#FFF',
    },
    reportDescription: {
        fontSize: 14,
        marginBottom: 12,
        lineHeight: 20,
    },
    reportFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    reportDate: {
        fontSize: 12,
        fontWeight: '400',
    },
    reward: {
        fontSize: 12,
        fontWeight: '600',
    },
    emptyCard: {
        alignItems: 'center',
        padding: 40,
        borderRadius: 12,
        borderWidth: 1,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 18,
    },
});
