import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AntDesign } from '@react-native-vector-icons/ant-design/static';
import { Feather } from '@react-native-vector-icons/feather/static';
import { Lucide } from '@react-native-vector-icons/lucide/static';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { images } from '../../assets';
import { useApp } from '../../context/AppContext';
import { Button, CountryPickerModal, DatePickerModal, useToast } from '../../components';
import useThemedStyles from '../../components/useThemedStyles';
import { formatDateNumberInput } from '../../utils/dateUtils';
import { DEFAULT_COUNTRY } from '../../utils/countries';
import createStyles from './style';
import {
  DRIVER_REGISTRATION_STEPS as STEPS,
  DRIVER_REGISTRATION_CHECKLIST as CHECKLIST,
  DRIVER_REGISTRATION_VEHICLE_TYPES as VEHICLE_TYPES,
  DRIVER_REVIEW_ITEMS as REVIEW_ITEMS,
} from '../../config/staticData';

export default function DriverRegistrationScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { colors } = useApp();
  const styles = useThemedStyles(createStyles);
  const { showToast } = useToast();

  const [step, setStep] = useState(1);

  // Step 1 State: Personal Details
  const [fullName, setFullName] = useState(route?.params?.name || 'Rahul Mehta');
  const [dob, setDob] = useState('14 Mar 1994');
  const [dobPickerVisible, setDobPickerVisible] = useState(false);
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);
  const [mobileNum, setMobileNum] = useState(route?.params?.mobile?.replace(/^\+\d+\s*/, '') || '98240 11234');
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [email, setEmail] = useState();
  const [hasPhoto, setHasPhoto] = useState(true);
  const [profilePhotoUri, setProfilePhotoUri] = useState(null);

  // Step 2 State: Driving Licence
  const [dlNumber, setDlNumber] = useState('GJ0120190012345');
  const [dlFrontStatus, setDlFrontStatus] = useState('verified');
  const [dlBackStatus, setDlBackStatus] = useState('blurred');
  const [dlFrontUri, setDlFrontUri] = useState(null);
  const [dlBackUri, setDlBackUri] = useState(null);

  // Step 3 State: Vehicle Details
  const [selectedVehicle, setSelectedVehicle] = useState('sedan');
  const [regNumber, setRegNumber] = useState('GJ 01 MJ 4821');
  const [plateDocStatus, setPlateDocStatus] = useState('uploaded');
  const [rcDocStatus, setRcDocStatus] = useState('required');
  const [plateUri, setPlateUri] = useState(null);
  const [rcUri, setRcUri] = useState(null);

  // Step 4 State: Insurance
  const [policyNumber, setPolicyNumber] = useState('OD-2026-4471-9920-3318');
  const [insuranceDocStatus, setInsuranceDocStatus] = useState('uploaded');
  const [insuranceExpiry, setInsuranceExpiry] = useState('30 Oct 2026');
  const [insurancePickerVisible, setInsurancePickerVisible] = useState(false);
  const [insuranceUri, setInsuranceUri] = useState(null);

  // Step 5 State: Bank & Payout
  const [accountHolder, setAccountHolder] = useState(fullName || 'Rahul Mehta');
  const [accountNumber, setAccountNumber] = useState('•••• •••• 4417');
  const [ifscCode, setIfscCode] = useState('HDFC0000342');

  // Step 6 State: Confirmation Checkbox
  const [termsConfirmed, setTermsConfirmed] = useState(true);

  const handleDobChange = text => {
    setDob(formatDateNumberInput(text));
  };

  const handleInsuranceExpiryChange = text => {
    setInsuranceExpiry(formatDateNumberInput(text));
  };

  const currentStepData = STEPS.find(s => s.step === step) || {
    step: 6,
    title: 'Everything checks out',
    percent: '100% complete',
    subtitle: '17 of 17 required items complete. You can still edit any section before submitting.',
    btnLabel: 'Submit for verification',
  };

  const handlePickImage = async (onSuccess, docName) => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      });

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        onSuccess(asset.uri);
        showToast({
          type: 'success',
          title: 'Image Selected',
          message: `${docName || 'Image'} updated successfully.`,
        });
      }
    } catch (err) {
      console.warn('Image picker error:', err);
    }
  };

  const handleHeaderBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    } else {
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('SetupAccount');
      }
    }
  };

  const handleNextStep = () => {
    if (step < 6) {
      setStep(prev => prev + 1);
    } else {
      showToast({
        type: 'success',
        title: 'Submitted for Verification',
        message: 'Your documents have been submitted to admin.',
      });

      navigation.navigate('DriverVerificationStatus', {
        mode: 'in_progress',
      });
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const renderStep1 = () => (
    <View>
      <View style={styles.profileCard}>
        <View style={styles.avatarWrap}>
          {profilePhotoUri ? (
            <Image
              source={{ uri: profilePhotoUri }}
              style={{ width: 56, height: 56, borderRadius: 28 }}
            />
          )
            // : hasPhoto ? (
            //   <Lucide name="user" size={30} color={colors.orange[500]} />
            // )
            : (
              <Lucide name="user-round" size={28} color={colors.gray[400]} />
            )}
        </View>
        <View style={styles.avatarTextWrap}>
          <Text style={styles.avatarTitle}>Profile photo *</Text>
          <Text style={styles.avatarSub}>Face forward, no cap or sunglasses</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          accessibilityRole="button"
          onPress={() =>
            handlePickImage(uri => {
              setProfilePhotoUri(uri);
              setHasPhoto(true);
            }, 'Profile photo')
          }
          style={styles.uploadPillBtn}>
          <Text style={styles.uploadPillText}>
            {profilePhotoUri ? 'Replace' : 'Upload'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Full name *</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Rahul Mehta"
            placeholderTextColor={colors.gray[400]}
            style={styles.textInput}
          />
        </View>
        <Text style={styles.fieldSubtext}>As printed on your driving licence</Text>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Date of birth *</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Open date picker"
          onPress={() => setDobPickerVisible(true)}
          style={[styles.inputWrap, { gap: 10 }]}>
          <Feather name="calendar" size={18} color={colors.gray[500]} />
          <TextInput
            value={dob}
            onChangeText={handleDobChange}
            placeholder="14 Mar 1994"
            placeholderTextColor={colors.gray[400]}
            keyboardType="number-pad"
            maxLength={11}
            style={styles.textInput}
            pointerEvents="none"
            editable={false}
          />
        </TouchableOpacity>
        <Text style={styles.fieldSubtext}>You must be 18 or older to drive on Cabora</Text>
      </View>

      {!isMobileVerified ? (
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Mobile number *</Text>
          <View style={styles.mobileInputRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Select country"
              onPress={() => setCountryPickerVisible(true)}
              style={styles.countryPickerPrefix}>
              {country.code === 'IN' ? (
                <Image
                  source={images.indiaFlag}
                  style={{ width: 22, height: 15, borderRadius: 2 }}
                  resizeMode="cover"
                />
              ) : (
                <Text style={{ fontSize: 18 }}>{country.flag}</Text>
              )}
              <Text style={styles.countryDialCode}>{country.dialCode}</Text>
              <Feather name="chevron-down" size={14} color={colors.gray[500]} />
              <View style={styles.prefixDividerLine} />
            </TouchableOpacity>

            <TextInput
              value={mobileNum}
              onChangeText={setMobileNum}
              placeholder="98240 11234"
              placeholderTextColor={colors.gray[400]}
              keyboardType="phone-pad"
              maxLength={14}
              style={styles.mobileTextInputField}
            />

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.verifyActionBtn}
              onPress={() => {
                if (mobileNum.replace(/\D/g, '').length >= 8) {
                  setIsMobileVerified(true);
                  showToast({
                    type: 'success',
                    title: 'Mobile Verified',
                    message: `${country.dialCode} ${mobileNum} verified successfully.`,
                  });
                } else {
                  showToast({
                    type: 'error',
                    title: 'Invalid Number',
                    message: 'Please enter a valid mobile number.',
                  });
                }
              }}>
              <Text style={styles.verifyActionBtnText}>Verify</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.fieldSubtext}>We send an OTP to verify mobile ownership</Text>
        </View>
      ) : (
        <View style={styles.verifiedMobileCard}>
          <View style={styles.checkIconWrap}>
            <AntDesign name="check" size={14} color={colors.green[700]} />
          </View>
          <View style={styles.mobileCopy}>
            <Text style={styles.mobileNumber}>{country.dialCode} {mobileNum}</Text>
            <Text style={styles.mobileSub}>Mobile number · verified at sign-in</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setIsMobileVerified(false)}
            style={styles.verifiedPill}>
            <Text style={styles.verifiedPillText}>Verified</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Email</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="name@example.com"
            placeholderTextColor={colors.gray[400]}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.textInput}
          />
        </View>
        <Text style={styles.fieldSubtext}>Optional — used for receipts and tax statements</Text>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Driving licence number *</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={dlNumber}
            onChangeText={setDlNumber}
            placeholder="GJ0120190012345"
            placeholderTextColor={colors.gray[400]}
            autoCapitalize="characters"
            style={styles.textInput}
          />
        </View>
        <Text style={styles.fieldSubtext}>15 characters, no spaces — as printed on the card</Text>
      </View>

      <View style={styles.twoColGrid}>
        <View style={[styles.docUploadBox, dlFrontStatus === 'verified' && styles.docUploadBoxVerified]}>
          <View style={styles.docIllustrationFront}>
            {dlFrontUri ? (
              <Image
                source={{ uri: dlFrontUri }}
                style={{ width: '100%', height: '100%', borderRadius: 10 }}
              />
            ) : (
              <View style={styles.idCardSkeletonFront}>
                <View style={styles.skeletonLineTop} />
                <View style={styles.skeletonLineMid} />
                <View style={styles.skeletonBlockBottom} />
              </View>
            )}
          </View>
          <Text style={styles.docTitle}>DL front *</Text>
          <View style={styles.docActionRow}>
            <View style={styles.statusPillVerified}>
              <Text style={styles.statusPillVerifiedText}>Verified</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                handlePickImage(uri => {
                  setDlFrontUri(uri);
                  setDlFrontStatus('verified');
                }, 'DL Front')
              }
              style={styles.btnPillGray}>
              <Text style={styles.btnPillGrayText}>
                {dlFrontUri ? 'Replace' : 'Upload'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.docUploadBox, dlBackStatus === 'blurred' && !dlBackUri && styles.docUploadBoxError]}>
          <View style={[styles.docIllustration, dlBackStatus === 'blurred' && !dlBackUri && styles.docIllustrationBackError]}>
            {dlBackUri ? (
              <Image
                source={{ uri: dlBackUri }}
                style={{ width: '100%', height: '100%', borderRadius: 10 }}
              />
            ) : (
              <View style={styles.idCardSkeletonBack}>
                <View style={styles.skeletonLineTopWhite} />
                <View style={styles.skeletonLineMidWhite} />
                <View style={styles.skeletonIconWrap}>
                  <Feather name="alert-triangle" size={18} color="#FFFFFF" />
                </View>
                <View style={styles.skeletonBlockBottomWhite} />
              </View>
            )}
          </View>
          <Text style={styles.docTitle}>DL back *</Text>
          <View style={styles.docActionRow}>
            {dlBackStatus === 'blurred' && !dlBackUri ? (
              <View style={styles.statusPillBlurred}>
                <Text style={styles.statusPillBlurredText}>Blurred</Text>
              </View>
            ) : (
              <View style={styles.statusPillVerified}>
                <Text style={styles.statusPillVerifiedText}>Verified</Text>
              </View>
            )}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                handlePickImage(uri => {
                  setDlBackUri(uri);
                  setDlBackStatus('verified');
                }, 'DL Back')
              }
              style={dlBackStatus === 'blurred' && !dlBackUri ? styles.btnPillRed : styles.btnPillGray}>
              <Text style={dlBackStatus === 'blurred' && !dlBackUri ? styles.btnPillRedText : styles.btnPillGrayText}>
                {dlBackUri ? 'Replace' : dlBackStatus === 'blurred' ? 'Retake' : 'Upload'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {dlBackStatus === 'blurred' && !dlBackUri && (
        <View style={styles.warningBanner}>
          <Feather name="alert-circle" size={18} color={colors.danger} style={styles.warningBannerIcon} />
          <Text style={styles.warningBannerText}>
            The back of your licence is out of focus. Retake it in daylight without flash.
          </Text>
        </View>
      )}

      <View style={styles.checklistCard}>
        <Text style={styles.checklistHeader}>WHAT WE CHECK</Text>
        {CHECKLIST.map(item => {
          let iconName = 'check-circle';
          let iconColor = '#16A34A';

          if (item.status === 'warning') {
            iconName = 'exclamation-circle';
            iconColor = '#D97706';
          } else if (item.status === 'info') {
            iconName = 'info-circle';
            iconColor = '#475569';
          }

          return (
            <View key={item.id} style={styles.checkRow}>
              <AntDesign name={iconName} size={18} color={iconColor} style={styles.checkIconMargin} />
              <Text style={styles.checkText}>{item.text}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={styles.fieldLabel}>Vehicle type *</Text>
      <View style={styles.vehicleGrid}>
        {VEHICLE_TYPES.map(vt => {
          const active = selectedVehicle === vt.id;
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={vt.id}
              onPress={() => setSelectedVehicle(vt.id)}
              style={[styles.vehicleCard, active && styles.vehicleCardActive]}>
              <View style={[styles.vehicleIconWrap, active && styles.vehicleIconWrapActive]}>
                {vt.icon === 'motorbike' ? (
                  <MaterialDesignIcons
                    name="motorbike"
                    size={22}
                    color={active ? colors.orange[500] : colors.gray[600]}
                  />
                ) : vt.icon === 'rickshaw' ? (
                  <MaterialDesignIcons
                    name="rickshaw"
                    size={22}
                    color={active ? colors.orange[500] : colors.gray[600]}
                  />
                ) : vt.icon === 'car-hatchback' ? (
                  <MaterialDesignIcons
                    name="car-hatchback"
                    size={22}
                    color={active ? colors.orange[500] : colors.gray[600]}
                  />
                ) : (
                  <MaterialDesignIcons
                    name="car-side"
                    size={22}
                    color={active ? colors.orange[500] : colors.gray[600]}
                  />
                )}
              </View>
              <Text style={styles.vehicleName}>{vt.name}</Text>
              <Text style={styles.vehicleMeta}>{vt.meta}</Text>
              {active && (
                <View style={styles.vehicleCheckMark}>
                  <AntDesign name="check" size={12} color={colors.white} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Vehicle registration number *</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={regNumber}
            onChangeText={setRegNumber}
            placeholder="GJ 01 MJ 4821"
            placeholderTextColor={colors.gray[400]}
            autoCapitalize="characters"
            style={styles.textInput}
          />
        </View>
        <Text style={styles.fieldSubtext}>Must match the RC exactly</Text>
      </View>

      <View style={[styles.docRowCard, (plateUri || plateDocStatus === 'uploaded') && styles.docRowCardVerified]}>
        <View style={styles.docRowThumb}>
          {plateUri ? (
            <Image
              source={{ uri: plateUri }}
              style={{ width: '100%', height: '100%', borderRadius: 12 }}
            />
          ) : (
            <View style={styles.plateIllustrationBadge}>
              <Text style={styles.plateIllustrationText}>GJ 01</Text>
            </View>
          )}
        </View>
        <View style={styles.docRowCopy}>
          <Text style={styles.docRowTitle}>Vehicle number plate *</Text>
          <Text style={styles.docRowMeta}>Photo of the rear plate, fully readable</Text>
          <View style={styles.docRowFooter}>
            <View style={styles.statusPillVerified}>
              <Text style={styles.statusPillVerifiedText}>Uploaded</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                handlePickImage(uri => {
                  setPlateUri(uri);
                  setPlateDocStatus('uploaded');
                }, 'Number Plate')
              }
              style={styles.btnPillGray}>
              <Text style={styles.btnPillGrayText}>Replace</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={[styles.docRowCard, (rcUri || rcDocStatus === 'uploaded') && styles.docRowCardVerified]}>
        <View style={styles.docRowThumb}>
          {rcUri ? (
            <Image
              source={{ uri: rcUri }}
              style={{ width: '100%', height: '100%', borderRadius: 12 }}
            />
          ) : (
            <Feather name="camera" size={24} color="#94A3B8" />
          )}
        </View>
        <View style={styles.docRowCopy}>
          <Text style={styles.docRowTitle}>RC document *</Text>
          <Text style={styles.docRowMeta}>Registration certificate, front page</Text>
          <View style={styles.docRowFooter}>
            {rcUri || rcDocStatus === 'uploaded' ? (
              <View style={styles.statusPillVerified}>
                <Text style={styles.statusPillVerifiedText}>Uploaded</Text>
              </View>
            ) : (
              <View style={styles.statusPillRequired}>
                <Text style={styles.statusPillRequiredText}>Required</Text>
              </View>
            )}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                handlePickImage(uri => {
                  setRcUri(uri);
                  setRcDocStatus('uploaded');
                }, 'RC Document')
              }
              style={rcUri || rcDocStatus === 'uploaded' ? styles.btnPillGray : styles.btnPillOrange}>
              <Text style={rcUri || rcDocStatus === 'uploaded' ? styles.btnPillGrayText : styles.btnPillOrangeText}>
                {rcUri || rcDocStatus === 'uploaded' ? 'Replace' : 'Upload'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View>
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Insurance policy number *</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={policyNumber}
            onChangeText={setPolicyNumber}
            placeholder="OD-2026-4471-9920-3318"
            placeholderTextColor={colors.gray[400]}
            style={styles.textInput}
          />
        </View>
        <Text style={styles.fieldSubtext}>Comprehensive or third-party, in the owner's name</Text>
      </View>

      <View style={[styles.docRowCard, styles.docRowCardVerified]}>
        <View style={styles.docRowThumbTall}>
          {insuranceUri ? (
            <Image
              source={{ uri: insuranceUri }}
              style={{ width: '100%', height: '100%', borderRadius: 12 }}
            />
          ) : (
            <View style={styles.tallDocSkeleton}>
              <View style={[styles.skeletonLineTop, { width: '80%', height: 5 }]} />
              <View style={[styles.skeletonLineMid, { width: '60%', height: 4, marginTop: 4 }]} />
              <View style={[styles.skeletonLineMid, { width: '70%', height: 4, marginTop: 4 }]} />
              <View style={[styles.skeletonLineMid, { width: '40%', height: 4, marginTop: 4 }]} />
              <View style={[styles.skeletonBlockBottom, { width: '35%', height: 12, marginTop: 8 }]} />
            </View>
          )}
        </View>
        <View style={styles.docRowCopy}>
          <Text style={styles.docRowTitle}>Insurance document *</Text>
          <Text style={styles.docRowMeta}>policy_od_2026.pdf · 1.8 MB</Text>
          <Text style={styles.docRowMetaSub}>Uploaded 19 Sep, 2:06 pm</Text>
          <View style={styles.docRowFooter}>
            <View style={styles.statusPillVerified}>
              <Text style={styles.statusPillVerifiedText}>Uploaded</Text>
            </View>
            <View style={styles.docRowButtonsGroup}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => showToast({ type: 'info', message: 'Opening document preview' })}
                style={styles.btnPillOrange}>
                <Text style={styles.btnPillOrangeText}>View</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  handlePickImage(uri => {
                    setInsuranceUri(uri);
                    setInsuranceDocStatus('uploaded');
                  }, 'Insurance Document')
                }
                style={styles.btnPillGray}>
                <Text style={styles.btnPillGrayText}>Replace</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Insurance expiry date *</Text>
        <TouchableOpacity
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Open date picker"
          onPress={() => setInsurancePickerVisible(true)}
          style={[styles.inputWrap, styles.inputWrapSuccess, { gap: 10 }]}>
          <Feather name="calendar" size={18} color={colors.text} />
          <TextInput
            value={insuranceExpiry}
            onChangeText={handleInsuranceExpiryChange}
            placeholder="30 Oct 2026"
            placeholderTextColor={colors.gray[400]}
            keyboardType="number-pad"
            maxLength={11}
            style={styles.textInput}
            pointerEvents="none"
            editable={false}
          />
          <AntDesign name="check-circle" size={18} color="#16A34A" />
        </TouchableOpacity>
        <View style={styles.successSubtextRow}>
          <AntDesign name="check-circle" size={14} color="#16A34A" />
          <Text style={styles.successSubtext}>
            Read from the document — 41 days left
          </Text>
        </View>
      </View>

      <View style={styles.amberNoticeBox}>
        <Feather name="alert-triangle" size={20} color="#B45309" style={{ marginTop: 2, marginRight: 12 }} />
        <View style={styles.amberNoticeCopy}>
          <Text style={styles.amberNoticeTitle}>Renew before it lapses</Text>
          <Text style={styles.amberNoticeText}>
            An expired policy blocks you from going online. We remind you 30, 15 and 7 days before.
          </Text>
        </View>
      </View>
    </View>
  );

  const renderStep5 = () => (
    <View>
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Account holder name *</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={accountHolder}
            onChangeText={setAccountHolder}
            placeholder="Rahul Mehta"
            placeholderTextColor={colors.gray[400]}
            style={styles.textInput}
          />
        </View>
        <Text style={styles.fieldSubtext}>Exactly as it appears in your bank records</Text>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Bank account number *</Text>
        <View style={styles.inputWrap}>
          <TextInput
            value={accountNumber}
            onChangeText={setAccountNumber}
            placeholder="•••• •••• 4417"
            placeholderTextColor={colors.gray[400]}
            style={styles.textInput}
          />
        </View>
        <Text style={styles.fieldSubtext}>Re-checked with a ₹1 test transfer</Text>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>IFSC code *</Text>
        <View style={[styles.inputWrap, styles.inputWrapSuccess, { gap: 10 }]}>
          <TextInput
            value={ifscCode}
            onChangeText={setIfscCode}
            placeholder="HDFC0000342"
            placeholderTextColor={colors.gray[400]}
            autoCapitalize="characters"
            style={styles.textInput}
          />
          <AntDesign name="check-circle" size={18} color="#16A34A" />
        </View>
        <View style={styles.successSubtextRow}>
          <AntDesign name="check-circle" size={14} color="#16A34A" />
          <Text style={styles.successSubtext}>
            Branch found automatically
          </Text>
        </View>
      </View>

      <View style={styles.bankBranchCard}>
        <View style={styles.bankBranchIconWrap}>
          <Feather name="briefcase" size={22} color="#16A34A" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.bankBranchTitle}>HDFC Bank</Text>
          <Text style={styles.bankBranchSub}>Ashram Road, Ahmedabad · GJ</Text>
          <Text style={styles.bankBranchVerified}>Account verified with a ₹1 test transfer</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <AntDesign name="info-circle" size={16} color="#64748B" style={{ marginRight: 10 }} />
        <Text style={styles.infoCardText}>
          Payouts run daily at 11 pm to this account. You can change it later from Wallet → Payout settings.
        </Text>
      </View>
    </View>
  );

  const renderStep6Review = () => (
    <View>
      {REVIEW_ITEMS.map(item => (
        <View key={item.id} style={styles.reviewCard}>
          <View style={styles.reviewIconWrap}>
            {item.icon === 'user' ? (
              <Lucide name="user" size={22} color={colors.green[700]} />
            ) : item.icon === 'credit-card' ? (
              <Feather name="credit-card" size={22} color={colors.green[700]} />
            ) : item.icon === 'car' ? (
              <MaterialDesignIcons name="car-side" size={22} color={colors.green[700]} />
            ) : item.icon === 'shield' ? (
              <Feather name="shield" size={22} color={colors.green[700]} />
            ) : (
              <Feather name="folder" size={22} color={colors.green[700]} />
            )}
          </View>
          <View style={styles.reviewCopy}>
            <Text style={styles.reviewTitle}>{item.title}</Text>
            <Text style={styles.reviewMeta}>{item.meta}</Text>
          </View>
          <View style={styles.reviewRight}>
            <Text style={styles.reviewCountText}>{item.count}</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              accessibilityRole="button"
              onPress={() => setStep(item.step)}
              style={styles.editPillBtn}>
              <Text style={styles.editPillText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <View style={styles.confirmCheckboxCard}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setTermsConfirmed(!termsConfirmed)}
          style={styles.confirmRow}>
          <View style={[styles.checkboxBox, termsConfirmed && styles.checkboxBoxActive]}>
            {termsConfirmed && <AntDesign name="check" size={14} color={colors.white} />}
          </View>
          <Text style={styles.confirmText}>
            I confirm every document is mine, currently valid, and I accept the Driver Terms and the Code of Conduct.
          </Text>
        </TouchableOpacity>
        <Text style={styles.termsLinkText}>Driver Terms · Code of Conduct</Text>
      </View>

      <View style={styles.verifyInfoBox}>
        <Feather name="alert-circle" size={18} color={colors.amber[800]} style={{ marginTop: 2 }} />
        <Text style={styles.verifyInfoText}>
          Verification usually finishes within 4 hours. We notify you and unlock the dashboard as soon as it clears.
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.root}>


      <View style={[styles.header, { paddingTop: insets.top > 0 ? insets.top + 4 : 12 }]}>
        <TouchableOpacity
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={handleHeaderBack}
          style={styles.headerBtn}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {step === 6 ? 'Review and submit' : 'Driver registration'}
        </Text>
        <View style={styles.headerBtn} />
      </View>

      {step <= 5 ? (
        <View style={styles.progressSection}>
          <Text style={styles.stepKicker}>STEP {step} OF 5</Text>
          <Text style={styles.stepTitle}>{currentStepData.title}</Text>
          <Text style={styles.stepSubtitle}>{currentStepData.subtitle}</Text>

          <View style={styles.progressBarRow}>
            {[1, 2, 3, 4, 5].map(s => (
              <View
                key={s}
                style={[
                  styles.progressSegment,
                  s <= step && styles.progressSegmentActive,
                ]}
              />
            ))}
          </View>
          <Text style={styles.percentText}>{currentStepData.percent}</Text>
        </View>
      ) : (
        <View style={styles.progressSection}>
          <Text style={styles.stepTitle}>Everything checks out</Text>
          <Text style={styles.stepSubtitle}>
            17 of 17 required items complete. You can still edit any section before submitting.
          </Text>
        </View>
      )}

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingBottom: Math.max(insets.bottom, 12) + 80 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
        {step === 5 && renderStep5()}
        {step === 6 && renderStep6Review()}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        {step > 1 && step <= 5 && (
          <Button
            title="Back"
            variant="outline"
            fullWidth={false}
            style={styles.btnBack}
            onPress={handlePrevStep}
          />
        )}
        <Button
          title={step === 6 ? 'Submit for verification' : currentStepData.btnLabel}
          variant="primary"
          fullWidth={false}
          style={step > 1 && step <= 5 ? styles.btnNext : styles.btnNextFull}
          onPress={handleNextStep}
        />
      </View>

      <DatePickerModal
        visible={dobPickerVisible}
        onClose={() => setDobPickerVisible(false)}
        onSelectDate={dateStr => setDob(dateStr)}
        value={dob}
        title="Select Date of Birth"
      />

      <DatePickerModal
        visible={insurancePickerVisible}
        onClose={() => setInsurancePickerVisible(false)}
        onSelectDate={dateStr => setInsuranceExpiry(dateStr)}
        value={insuranceExpiry}
        title="Select Insurance Expiry Date"
      />

      <CountryPickerModal
        visible={countryPickerVisible}
        selectedCountry={country}
        onSelect={setCountry}
        onClose={() => setCountryPickerVisible(false)}
      />
    </View>
  );
}
