package io.everyonecodes.pbltest.service;

import io.everyonecodes.pbltest.dto.UserDto;
import io.everyonecodes.pbltest.entities.User;
import io.everyonecodes.pbltest.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.ArgumentCaptor;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private UserService userService;

    private User sampleUser;
    private UUID sampleId;

    @BeforeEach
    void setUp() {
        sampleId = UUID.randomUUID();
        sampleUser = new User();
        sampleUser.setId(sampleId);
        sampleUser.setUsername("johndoe");
        sampleUser.setEmail("john@example.com");
        sampleUser.setPublicKey("pubkey123");
        sampleUser.setActivationKey(1234);
        sampleUser.setEnabled(false);
    }

    @Nested
    @DisplayName("Tests for findUserById & findUserByUsername")
    class FindUserTests {

        @Test
        @DisplayName("findUserById: should return User when exists")
        void findUserById_Success() {
            when(userRepository.findById(sampleId)).thenReturn(Optional.of(sampleUser));

            Optional<User> result = userService.findUserById(sampleId);

            assertThat(result).isPresent().contains(sampleUser);
            verify(userRepository).findById(sampleId);
        }

        @Test
        @DisplayName("findUserById: should return empty Optional when not found")
        void findUserById_NotFound() {
            when(userRepository.findById(sampleId)).thenReturn(Optional.empty());

            Optional<User> result = userService.findUserById(sampleId);

            assertThat(result).isEmpty();
        }

        @Test
        @DisplayName("findUserByUsername: should return User when exists")
        void findUserByUsername_Success() {
            when(userRepository.findUserByUsername("johndoe")).thenReturn(Optional.of(sampleUser));

            Optional<User> result = userService.findUserByUsername("johndoe");

            assertThat(result).isPresent().contains(sampleUser);
        }

        @Test
        @DisplayName("findUserByUsername: should return empty Optional when not found")
        void findUserByUsername_NotFound() {
            when(userRepository.findUserByUsername("unknown")).thenReturn(Optional.empty());

            Optional<User> result = userService.findUserByUsername("unknown");

            assertThat(result).isEmpty();
        }
    }

    @Nested
    @DisplayName("Tests for findUserBySubString")
    class FindUserBySubStringTests {

        @Test
        @DisplayName("findUserBySubString: should map matching users to UserDto list")
        void findUserBySubString_Success() {
            when(userRepository.findByUsernameContainingIgnoreCase("john"))
                    .thenReturn(Optional.of(List.of(sampleUser)));

            List<UserDto> result = userService.findUserBySubString("john");

            assertThat(result).hasSize(1);
            assertThat(result.get(0).username()).isEqualTo("johndoe");
            assertThat(result.get(0).email()).isEqualTo("john@example.com");
        }

        @Test
        @DisplayName("findUserBySubString: should return empty list when repository returns Optional.empty()")
        void findUserBySubString_EmptyOptional() {
            when(userRepository.findByUsernameContainingIgnoreCase("xyz")).thenReturn(Optional.empty());

            List<UserDto> result = userService.findUserBySubString("xyz");

            assertThat(result).isEmpty();
        }

        @Test
        @DisplayName("findUserBySubString: should return empty list when no match found")
        void findUserBySubString_EmptyList() {
            when(userRepository.findByUsernameContainingIgnoreCase("xyz")).thenReturn(Optional.of(Collections.emptyList()));

            List<UserDto> result = userService.findUserBySubString("xyz");

            assertThat(result).isEmpty();
        }
    }

    @Nested
    @DisplayName("Tests for isUserExisting")
    class IsUserExistingTests {

        @Test
        @DisplayName("isUserExisting: should return true if username or email exists")
        void isUserExisting_True() {
            when(userRepository.existsByUsernameOrEmail("johndoe", "john@example.com")).thenReturn(true);

            boolean exists = userService.isUserExisting("johndoe", "john@example.com");

            assertThat(exists).isTrue();
        }

        @Test
        @DisplayName("isUserExisting: should return false if neither username nor email exists")
        void isUserExisting_False() {
            when(userRepository.existsByUsernameOrEmail("newuser", "new@example.com")).thenReturn(false);

            boolean exists = userService.isUserExisting("newuser", "new@example.com");

            assertThat(exists).isFalse();
        }
    }

    @Nested
    @DisplayName("Tests for saveUser")
    class SaveUserTests {

        @Test
        @DisplayName("saveUser: should send email first, then save user")
        void saveUser_Success_CorrectOrder() {
            InOrder inOrder = inOrder(emailService, userRepository);

            userService.saveUser(sampleUser);

            inOrder.verify(emailService).sendVerificationEmail("john@example.com", 1234);
            inOrder.verify(userRepository).save(sampleUser);
        }

        @Test
        @DisplayName("saveUser: should NOT save user if email sending throws exception")
        void saveUser_EmailFailure_DoesNotSaveUser() {
            doThrow(new RuntimeException("SMTP Server down"))
                    .when(emailService).sendVerificationEmail(anyString(), anyInt());

            assertThatThrownBy(() -> userService.saveUser(sampleUser))
                    .isInstanceOf(RuntimeException.class)
                    .hasMessage("SMTP Server down");

            verify(userRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("Tests for validateUserByUsername & validateUserById")
    class ValidateUserTests {

        @Test
        @DisplayName("validateUserByUsername: should return User when found")
        void validateUserByUsername_Success() {
            when(userRepository.findUserByUsername("johndoe")).thenReturn(Optional.of(sampleUser));

            User user = userService.validateUserByUsername("johndoe");

            assertThat(user).isNotNull().isEqualTo(sampleUser);
        }

        @Test
        @DisplayName("validateUserByUsername: should throw EntityNotFoundException when user missing")
        void validateUserByUsername_NotFound() {
            when(userRepository.findUserByUsername("unknown")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> userService.validateUserByUsername("unknown"))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessage("User not found!");
        }

        @Test
        @DisplayName("validateUserById: should return User when found")
        void validateUserById_Success() {
            when(userRepository.findById(sampleId)).thenReturn(Optional.of(sampleUser));

            User user = userService.validateUserById(sampleId);

            assertThat(user).isNotNull().isEqualTo(sampleUser);
        }

        @Test
        @DisplayName("validateUserById: should throw EntityNotFoundException when user missing")
        void validateUserById_NotFound() {
            when(userRepository.findById(sampleId)).thenReturn(Optional.empty());

            assertThatThrownBy(() -> userService.validateUserById(sampleId))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessage("User not found!");
        }
    }

    @Nested
    @DisplayName("Tests for Public Key Operations")
    class PublicKeyTests {

        @Test
        @DisplayName("getPublicKey: should return public key of validated user")
        void getPublicKey_Success() {
            when(userRepository.findUserByUsername("johndoe")).thenReturn(Optional.of(sampleUser));

            String key = userService.getPublicKey("johndoe");

            assertThat(key).isEqualTo("pubkey123");
        }

        @Test
        @DisplayName("setPublicKey: should update public key on target user")
        void setPublicKey_Success() {
            when(userRepository.findUserByUsername("johndoe")).thenReturn(Optional.of(sampleUser));

            userService.setPublicKey("johndoe", "newPubKey999");

            assertThat(sampleUser.getPublicKey()).isEqualTo("newPubKey999");
        }
    }

    @Nested
    @DisplayName("Tests for verifyUser (Edge Cases & Exception Scenarios)")
    class VerifyUserTests {

        @Test
        @DisplayName("verifyUser: success when code matches activation key")
        void verifyUser_Success() {
            when(userRepository.findUserByUsername("johndoe")).thenReturn(Optional.of(sampleUser));

            String result = userService.verifyUser("johndoe", "1234");

            assertThat(result).isEqualTo("Verification ended successfully!");
            assertThat(sampleUser.isEnabled()).isTrue();
        }

        @Test
        @DisplayName("verifyUser: fail when code is valid integer but does NOT match key")
        void verifyUser_IncorrectCode() {
            when(userRepository.findUserByUsername("johndoe")).thenReturn(Optional.of(sampleUser));

            String result = userService.verifyUser("johndoe", "9999");

            assertThat(result).isEqualTo("Invalid code!");
            assertThat(sampleUser.isEnabled()).isFalse();
        }

        @ParameterizedTest
        @ValueSource(strings = {"abc", "12a", "", " ", "9999999999999999999", "3.14"})
        @DisplayName("verifyUser: return 'Invalid code!' when code cannot be parsed to Integer")
        void verifyUser_NonNumericOrInvalidFormatCode(String invalidCode) {
            when(userRepository.findUserByUsername("johndoe")).thenReturn(Optional.of(sampleUser));

            String result = userService.verifyUser("johndoe", invalidCode);

            assertThat(result).isEqualTo("Invalid code!");
            assertThat(sampleUser.isEnabled()).isFalse();
        }

        @Test
        @DisplayName("verifyUser: return 'Invalid code!' when code is null")
        void verifyUser_NullCode() {
            when(userRepository.findUserByUsername("johndoe")).thenReturn(Optional.of(sampleUser));

            String result = userService.verifyUser("johndoe", null);

            assertThat(result).isEqualTo("Invalid code!");
            assertThat(sampleUser.isEnabled()).isFalse();
        }

        @Test
        @DisplayName("verifyUser: throw EntityNotFoundException if user does not exist")
        void verifyUser_UserNotFound() {
            when(userRepository.findUserByUsername("ghost")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> userService.verifyUser("ghost", "1234"))
                    .isInstanceOf(EntityNotFoundException.class)
                    .hasMessage("User not found!");
        }
    }

    @Nested
    @DisplayName("Tests for resendNewKey")
    class ResendNewKeyTests {

        @Test
        @DisplayName("resendNewKey: generate new 4-digit key and send email")
        void resendNewKey_Success() {
            when(userRepository.findUserByUsername("johndoe")).thenReturn(Optional.of(sampleUser));

            userService.resendNewKey("johndoe");

            ArgumentCaptor<Integer> keyCaptor = ArgumentCaptor.forClass(Integer.class);
            verify(emailService).sendVerificationEmail(eq("john@example.com"), keyCaptor.capture());

            Integer generatedKey = keyCaptor.getValue();
            assertThat(generatedKey).isGreaterThanOrEqualTo(0).isLessThan(10000);
            assertThat(sampleUser.getActivationKey()).isEqualTo(generatedKey);
        }

        @Test
        @DisplayName("resendNewKey: throw exception if user is missing and NOT call emailService")
        void resendNewKey_UserNotFound() {
            when(userRepository.findUserByUsername("unknown")).thenReturn(Optional.empty());

            assertThatThrownBy(() -> userService.resendNewKey("unknown"))
                    .isInstanceOf(EntityNotFoundException.class);

            verify(emailService, never()).sendVerificationEmail(anyString(), anyInt());
        }
    }
}