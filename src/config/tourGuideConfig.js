import { createTheme } from '@wrack/react-native-tour-guide';

export const TOUR_IDS = {
  PASSENGER_DASHBOARD: 'cabora_passenger_dashboard_tour_v1',
  DRIVER_DASHBOARD: 'cabora_driver_dashboard_tour_v1',
};

/**
 * Generates an accessible, branded TourGuide theme that honors dark/light modes.
 *
 * @param {object} colors App color palette
 * @returns {object} TourTheme config object
 */
export function getTourTheme(colors) {
  const isDark = Boolean(colors?.isDark);
  const primaryOrange = colors?.orange?.[500] || '#FF6A00';

  return createTheme({
    tooltipStyles: {
      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
      borderRadius: 16,
      titleColor: isDark ? '#F8FAFC' : '#0F172A',
      descriptionColor: isDark ? '#94A3B8' : '#64748B',
      primaryButtonColor: primaryOrange,
      secondaryButtonColor: isDark ? '#334155' : '#F1F5F9',
      buttonTextColor: '#FFFFFF',
      skipButtonColor: isDark ? '#94A3B8' : '#64748B',
      titleStyle: {
        fontSize: 16,
        fontWeight: '700',
      },
      descriptionStyle: {
        fontSize: 13,
        lineHeight: 18,
      },
      containerStyle: {
        padding: 16,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 12,
      },
    },
    spotlightStyles: {
      overlayColor: '#000000',
      overlayOpacity: 0.72,
      enablePulse: true,
      pulseColor: primaryOrange,
      pulseWidth: 2,
    },
  });
}

/**
 * Tour steps for the Passenger Dashboard (HomeScreen)
 */
export const PASSENGER_DASHBOARD_STEPS = [
  {
    id: 'passenger-search-ride',
    targetId: 'passenger-search-card',
    title: 'Book Your Ride 🚖',
    description: 'Tap here to enter your destination, choose a pickup point, or select a saved favorite.',
    tooltipPosition: 'bottom',
    spotlightPadding: 6,
  },
  {
    id: 'passenger-shortcuts',
    targetId: 'passenger-shortcuts-row',
    title: 'One-Tap Shortcuts ⚡',
    description: 'Quickly set your ride to Home, Work, or add frequently visited places for one-tap booking.',
    tooltipPosition: 'bottom',
    spotlightPadding: 6,
  },
  {
    id: 'passenger-explore',
    targetId: 'passenger-explore-section',
    title: 'Explore Services 🛵',
    description: 'Pick from Autos, Moto bikes, comfortable Sedans, Outstation rentals, and courier delivery.',
    tooltipPosition: 'top',
    spotlightPadding: 6,
  },
  {
    id: 'passenger-recenter',
    targetId: 'passenger-locate-btn',
    title: 'Center Map 📍',
    description: 'Tap anytime to re-center the map on your exact GPS location.',
    tooltipPosition: 'left',
    spotlightPadding: 6,
  },
  {
    id: 'passenger-drawer',
    targetId: 'passenger-menu-btn',
    title: 'Menu & Safety Center 🛡️',
    description: 'Access trip history, wallet, promotions, emergency contacts, and profile settings.',
    tooltipPosition: 'bottom',
    spotlightPadding: 6,
  },
];

/**
 * Tour steps for the Driver Dashboard (DriverHomeScreen)
 */
export const DRIVER_DASHBOARD_STEPS = [
  {
    id: 'driver-status-toggle',
    targetId: 'driver-status-card',
    title: 'Go Online to Earn 🟢',
    description: 'Toggle this switch to go online and immediately start receiving ride requests around you.',
    tooltipPosition: 'bottom',
    spotlightPadding: 6,
  },
  {
    id: 'driver-stats-overview',
    targetId: 'driver-stats-row',
    title: "Today's Performance 💰",
    description: "Monitor today's total earnings, completed trips, hours online, and wallet balance.",
    tooltipPosition: 'bottom',
    spotlightPadding: 6,
  },
  {
    id: 'driver-destination-btn',
    targetId: 'driver-preferred-dest-fab',
    title: 'Preferred Destination 🎯',
    description: 'Set your destination (e.g. heading home) to receive ride requests along your path.',
    tooltipPosition: 'left',
    spotlightPadding: 6,
  },
  {
    id: 'driver-search-requests',
    targetId: 'driver-search-fab',
    title: 'Ride Request Radar 📡',
    description: 'Scan and browse incoming trip requests with upfront fare and customer pickup details.',
    tooltipPosition: 'left',
    spotlightPadding: 6,
  },
  {
    id: 'driver-menu-hub',
    targetId: 'driver-menu-btn',
    title: 'Driver Hub & Settings ⚙️',
    description: 'Check document status, daily vehicle safety checklists, incentives, and payout accounts.',
    tooltipPosition: 'bottom',
    spotlightPadding: 6,
  },
];
