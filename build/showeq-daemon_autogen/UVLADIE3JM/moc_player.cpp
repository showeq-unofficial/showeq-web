/****************************************************************************
** Meta object code from reading C++ file 'player.h'
**
** Created by: The Qt Meta Object Compiler version 67 (Qt 5.15.13)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include <memory>
#include "../../../../showeq-daemon/src/player.h"
#include <QtCore/qbytearray.h>
#include <QtCore/qmetatype.h>
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'player.h' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 67
#error "This file was generated using the moc from 5.15.13. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
QT_WARNING_PUSH
QT_WARNING_DISABLE_DEPRECATED
struct qt_meta_stringdata_Player_t {
    QByteArrayData data[109];
    char stringdata0[1137];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    qptrdiff(offsetof(qt_meta_stringdata_Player_t, stringdata0) + ofs \
        - idx * sizeof(QByteArrayData)) \
    )
static const qt_meta_stringdata_Player_t qt_meta_stringdata_Player = {
    {
QT_MOC_LITERAL(0, 0, 6), // "Player"
QT_MOC_LITERAL(1, 7, 9), // "newPlayer"
QT_MOC_LITERAL(2, 17, 0), // ""
QT_MOC_LITERAL(3, 18, 8), // "buffLoad"
QT_MOC_LITERAL(4, 27, 16), // "const spellBuff*"
QT_MOC_LITERAL(5, 44, 8), // "newSpeed"
QT_MOC_LITERAL(6, 53, 5), // "speed"
QT_MOC_LITERAL(7, 59, 11), // "statChanged"
QT_MOC_LITERAL(8, 71, 7), // "statNum"
QT_MOC_LITERAL(9, 79, 3), // "val"
QT_MOC_LITERAL(10, 83, 3), // "max"
QT_MOC_LITERAL(11, 87, 8), // "addSkill"
QT_MOC_LITERAL(12, 96, 11), // "changeSkill"
QT_MOC_LITERAL(13, 108, 12), // "deleteSkills"
QT_MOC_LITERAL(14, 121, 11), // "addLanguage"
QT_MOC_LITERAL(15, 133, 14), // "changeLanguage"
QT_MOC_LITERAL(16, 148, 15), // "deleteLanguages"
QT_MOC_LITERAL(17, 164, 6), // "setExp"
QT_MOC_LITERAL(18, 171, 8), // "uint32_t"
QT_MOC_LITERAL(19, 180, 8), // "totalExp"
QT_MOC_LITERAL(20, 189, 9), // "totalTick"
QT_MOC_LITERAL(21, 199, 11), // "minExpLevel"
QT_MOC_LITERAL(22, 211, 11), // "maxExpLevel"
QT_MOC_LITERAL(23, 223, 12), // "tickExpLevel"
QT_MOC_LITERAL(24, 236, 6), // "newExp"
QT_MOC_LITERAL(25, 243, 9), // "setAltExp"
QT_MOC_LITERAL(26, 253, 6), // "maxExp"
QT_MOC_LITERAL(27, 260, 7), // "tickExp"
QT_MOC_LITERAL(28, 268, 8), // "aapoints"
QT_MOC_LITERAL(29, 277, 9), // "newAltExp"
QT_MOC_LITERAL(30, 287, 16), // "expAltChangedInt"
QT_MOC_LITERAL(31, 304, 13), // "expChangedInt"
QT_MOC_LITERAL(32, 318, 9), // "expGained"
QT_MOC_LITERAL(33, 328, 11), // "manaChanged"
QT_MOC_LITERAL(34, 340, 11), // "stamChanged"
QT_MOC_LITERAL(35, 352, 9), // "hpChanged"
QT_MOC_LITERAL(36, 362, 7), // "int16_t"
QT_MOC_LITERAL(37, 370, 9), // "changedID"
QT_MOC_LITERAL(38, 380, 8), // "uint16_t"
QT_MOC_LITERAL(39, 389, 11), // "oldPlayerID"
QT_MOC_LITERAL(40, 401, 11), // "newPlayerID"
QT_MOC_LITERAL(41, 413, 10), // "posChanged"
QT_MOC_LITERAL(42, 424, 1), // "x"
QT_MOC_LITERAL(43, 426, 1), // "y"
QT_MOC_LITERAL(44, 428, 1), // "z"
QT_MOC_LITERAL(45, 430, 6), // "deltaX"
QT_MOC_LITERAL(46, 437, 6), // "deltaY"
QT_MOC_LITERAL(47, 444, 6), // "deltaZ"
QT_MOC_LITERAL(48, 451, 7), // "int32_t"
QT_MOC_LITERAL(49, 459, 7), // "heading"
QT_MOC_LITERAL(50, 467, 10), // "changeItem"
QT_MOC_LITERAL(51, 478, 11), // "const Item*"
QT_MOC_LITERAL(52, 490, 4), // "item"
QT_MOC_LITERAL(53, 495, 10), // "changeType"
QT_MOC_LITERAL(54, 506, 14), // "headingChanged"
QT_MOC_LITERAL(55, 521, 12), // "levelChanged"
QT_MOC_LITERAL(56, 534, 7), // "uint8_t"
QT_MOC_LITERAL(57, 542, 5), // "level"
QT_MOC_LITERAL(58, 548, 12), // "guildChanged"
QT_MOC_LITERAL(59, 561, 12), // "playerUpdate"
QT_MOC_LITERAL(60, 574, 14), // "const uint8_t*"
QT_MOC_LITERAL(61, 589, 4), // "data"
QT_MOC_LITERAL(62, 594, 6), // "size_t"
QT_MOC_LITERAL(63, 601, 3), // "len"
QT_MOC_LITERAL(64, 605, 3), // "dir"
QT_MOC_LITERAL(65, 609, 5), // "clear"
QT_MOC_LITERAL(66, 615, 5), // "reset"
QT_MOC_LITERAL(67, 621, 26), // "setUseAutoDetectedSettings"
QT_MOC_LITERAL(68, 648, 6), // "enable"
QT_MOC_LITERAL(69, 655, 14), // "setDefaultName"
QT_MOC_LITERAL(70, 670, 18), // "setDefaultLastname"
QT_MOC_LITERAL(71, 689, 15), // "setDefaultLevel"
QT_MOC_LITERAL(72, 705, 14), // "setDefaultRace"
QT_MOC_LITERAL(73, 720, 15), // "setDefaultClass"
QT_MOC_LITERAL(74, 736, 15), // "setDefaultDeity"
QT_MOC_LITERAL(75, 752, 6), // "player"
QT_MOC_LITERAL(76, 759, 24), // "const charProfileStruct*"
QT_MOC_LITERAL(77, 784, 11), // "loadProfile"
QT_MOC_LITERAL(78, 796, 19), // "playerProfileStruct"
QT_MOC_LITERAL(79, 816, 13), // "increaseSkill"
QT_MOC_LITERAL(80, 830, 6), // "skilli"
QT_MOC_LITERAL(81, 837, 10), // "manaChange"
QT_MOC_LITERAL(82, 848, 4), // "mana"
QT_MOC_LITERAL(83, 853, 9), // "updateExp"
QT_MOC_LITERAL(84, 863, 3), // "exp"
QT_MOC_LITERAL(85, 867, 12), // "updateAltExp"
QT_MOC_LITERAL(86, 880, 6), // "altexp"
QT_MOC_LITERAL(87, 887, 11), // "updateLevel"
QT_MOC_LITERAL(88, 899, 7), // "levelup"
QT_MOC_LITERAL(89, 907, 11), // "updateNpcHP"
QT_MOC_LITERAL(90, 919, 8), // "hpupdate"
QT_MOC_LITERAL(91, 928, 15), // "updateSpawnInfo"
QT_MOC_LITERAL(92, 944, 2), // "su"
QT_MOC_LITERAL(93, 947, 13), // "updateStamina"
QT_MOC_LITERAL(94, 961, 4), // "stam"
QT_MOC_LITERAL(95, 966, 11), // "setLastKill"
QT_MOC_LITERAL(96, 978, 4), // "name"
QT_MOC_LITERAL(97, 983, 11), // "zoneChanged"
QT_MOC_LITERAL(98, 995, 16), // "playerUpdateSelf"
QT_MOC_LITERAL(99, 1012, 7), // "pupdate"
QT_MOC_LITERAL(100, 1020, 11), // "consMessage"
QT_MOC_LITERAL(101, 1032, 3), // "con"
QT_MOC_LITERAL(102, 1036, 19), // "tradeSpellBookSlots"
QT_MOC_LITERAL(103, 1056, 11), // "setPlayerID"
QT_MOC_LITERAL(104, 1068, 8), // "playerID"
QT_MOC_LITERAL(105, 1077, 15), // "savePlayerState"
QT_MOC_LITERAL(106, 1093, 18), // "restorePlayerState"
QT_MOC_LITERAL(107, 1112, 14), // "setUseDefaults"
QT_MOC_LITERAL(108, 1127, 9) // "bdefaults"

    },
    "Player\0newPlayer\0\0buffLoad\0const spellBuff*\0"
    "newSpeed\0speed\0statChanged\0statNum\0"
    "val\0max\0addSkill\0changeSkill\0deleteSkills\0"
    "addLanguage\0changeLanguage\0deleteLanguages\0"
    "setExp\0uint32_t\0totalExp\0totalTick\0"
    "minExpLevel\0maxExpLevel\0tickExpLevel\0"
    "newExp\0setAltExp\0maxExp\0tickExp\0"
    "aapoints\0newAltExp\0expAltChangedInt\0"
    "expChangedInt\0expGained\0manaChanged\0"
    "stamChanged\0hpChanged\0int16_t\0changedID\0"
    "uint16_t\0oldPlayerID\0newPlayerID\0"
    "posChanged\0x\0y\0z\0deltaX\0deltaY\0deltaZ\0"
    "int32_t\0heading\0changeItem\0const Item*\0"
    "item\0changeType\0headingChanged\0"
    "levelChanged\0uint8_t\0level\0guildChanged\0"
    "playerUpdate\0const uint8_t*\0data\0"
    "size_t\0len\0dir\0clear\0reset\0"
    "setUseAutoDetectedSettings\0enable\0"
    "setDefaultName\0setDefaultLastname\0"
    "setDefaultLevel\0setDefaultRace\0"
    "setDefaultClass\0setDefaultDeity\0player\0"
    "const charProfileStruct*\0loadProfile\0"
    "playerProfileStruct\0increaseSkill\0"
    "skilli\0manaChange\0mana\0updateExp\0exp\0"
    "updateAltExp\0altexp\0updateLevel\0levelup\0"
    "updateNpcHP\0hpupdate\0updateSpawnInfo\0"
    "su\0updateStamina\0stam\0setLastKill\0"
    "name\0zoneChanged\0playerUpdateSelf\0"
    "pupdate\0consMessage\0con\0tradeSpellBookSlots\0"
    "setPlayerID\0playerID\0savePlayerState\0"
    "restorePlayerState\0setUseDefaults\0"
    "bdefaults"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_Player[] = {

 // content:
       8,       // revision
       0,       // classname
       0,    0, // classinfo
      55,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
      27,       // signalCount

 // signals: name, argc, parameters, tag, flags
       1,    0,  289,    2, 0x06 /* Public */,
       3,    1,  290,    2, 0x06 /* Public */,
       5,    1,  293,    2, 0x06 /* Public */,
       7,    3,  296,    2, 0x06 /* Public */,
      11,    2,  303,    2, 0x06 /* Public */,
      12,    2,  308,    2, 0x06 /* Public */,
      13,    0,  313,    2, 0x06 /* Public */,
      14,    2,  314,    2, 0x06 /* Public */,
      15,    2,  319,    2, 0x06 /* Public */,
      16,    0,  324,    2, 0x06 /* Public */,
      17,    5,  325,    2, 0x06 /* Public */,
      24,    6,  336,    2, 0x06 /* Public */,
      25,    4,  349,    2, 0x06 /* Public */,
      29,    6,  358,    2, 0x06 /* Public */,
      30,    3,  371,    2, 0x06 /* Public */,
      31,    3,  378,    2, 0x06 /* Public */,
      32,    4,  385,    2, 0x06 /* Public */,
      33,    2,  394,    2, 0x06 /* Public */,
      34,    4,  399,    2, 0x06 /* Public */,
      35,    2,  408,    2, 0x06 /* Public */,
      37,    2,  413,    2, 0x06 /* Public */,
      41,    7,  418,    2, 0x06 /* Public */,
      50,    2,  433,    2, 0x06 /* Public */,
      54,    1,  438,    2, 0x06 /* Public */,
      55,    1,  441,    2, 0x06 /* Public */,
      58,    0,  444,    2, 0x06 /* Public */,
      59,    3,  445,    2, 0x06 /* Public */,

 // slots: name, argc, parameters, tag, flags
      65,    0,  452,    2, 0x0a /* Public */,
      66,    0,  453,    2, 0x0a /* Public */,
      67,    1,  454,    2, 0x0a /* Public */,
      69,    1,  457,    2, 0x0a /* Public */,
      70,    1,  460,    2, 0x0a /* Public */,
      71,    1,  463,    2, 0x0a /* Public */,
      72,    1,  466,    2, 0x0a /* Public */,
      73,    1,  469,    2, 0x0a /* Public */,
      74,    1,  472,    2, 0x0a /* Public */,
      75,    1,  475,    2, 0x0a /* Public */,
      77,    1,  478,    2, 0x0a /* Public */,
      79,    1,  481,    2, 0x0a /* Public */,
      81,    1,  484,    2, 0x0a /* Public */,
      83,    1,  487,    2, 0x0a /* Public */,
      85,    1,  490,    2, 0x0a /* Public */,
      87,    1,  493,    2, 0x0a /* Public */,
      89,    1,  496,    2, 0x0a /* Public */,
      91,    1,  499,    2, 0x0a /* Public */,
      93,    1,  502,    2, 0x0a /* Public */,
      95,    2,  505,    2, 0x0a /* Public */,
      97,    0,  510,    2, 0x0a /* Public */,
      98,    3,  511,    2, 0x0a /* Public */,
     100,    3,  518,    2, 0x0a /* Public */,
     102,    3,  525,    2, 0x0a /* Public */,
     103,    1,  532,    2, 0x0a /* Public */,
     105,    0,  535,    2, 0x0a /* Public */,
     106,    0,  536,    2, 0x0a /* Public */,
     107,    1,  537,    2, 0x0a /* Public */,

 // signals: parameters
    QMetaType::Void,
    QMetaType::Void, 0x80000000 | 4,    2,
    QMetaType::Void, QMetaType::Double,    6,
    QMetaType::Void, QMetaType::Int, QMetaType::Int, QMetaType::Int,    8,    9,   10,
    QMetaType::Void, QMetaType::Int, QMetaType::Int,    2,    2,
    QMetaType::Void, QMetaType::Int, QMetaType::Int,    2,    2,
    QMetaType::Void,
    QMetaType::Void, QMetaType::Int, QMetaType::Int,    2,    2,
    QMetaType::Void, QMetaType::Int, QMetaType::Int,    2,    2,
    QMetaType::Void,
    QMetaType::Void, 0x80000000 | 18, 0x80000000 | 18, 0x80000000 | 18, 0x80000000 | 18, 0x80000000 | 18,   19,   20,   21,   22,   23,
    QMetaType::Void, 0x80000000 | 18, 0x80000000 | 18, 0x80000000 | 18, 0x80000000 | 18, 0x80000000 | 18, 0x80000000 | 18,   24,   19,   20,   21,   22,   23,
    QMetaType::Void, 0x80000000 | 18, 0x80000000 | 18, 0x80000000 | 18, 0x80000000 | 18,   19,   26,   27,   28,
    QMetaType::Void, 0x80000000 | 18, 0x80000000 | 18, 0x80000000 | 18, 0x80000000 | 18, 0x80000000 | 18, 0x80000000 | 18,   24,   19,   20,   26,   27,   28,
    QMetaType::Void, QMetaType::Int, QMetaType::Int, QMetaType::Int,    2,    2,    2,
    QMetaType::Void, QMetaType::Int, QMetaType::Int, QMetaType::Int,    2,    2,    2,
    QMetaType::Void, QMetaType::QString, QMetaType::Int, QMetaType::Long, QMetaType::QString,    2,    2,    2,    2,
    QMetaType::Void, 0x80000000 | 18, 0x80000000 | 18,    2,    2,
    QMetaType::Void, QMetaType::Int, QMetaType::Int, QMetaType::Int, QMetaType::Int,    2,    2,    2,    2,
    QMetaType::Void, 0x80000000 | 36, 0x80000000 | 36,    2,    2,
    QMetaType::Void, 0x80000000 | 38, 0x80000000 | 38,   39,   40,
    QMetaType::Void, 0x80000000 | 36, 0x80000000 | 36, 0x80000000 | 36, 0x80000000 | 36, 0x80000000 | 36, 0x80000000 | 36, 0x80000000 | 48,   42,   43,   44,   45,   46,   47,   49,
    QMetaType::Void, 0x80000000 | 51, 0x80000000 | 18,   52,   53,
    QMetaType::Void, 0x80000000 | 48,   49,
    QMetaType::Void, 0x80000000 | 56,   57,
    QMetaType::Void,
    QMetaType::Void, 0x80000000 | 60, 0x80000000 | 62, 0x80000000 | 56,   61,   63,   64,

 // slots: parameters
    QMetaType::Void,
    QMetaType::Void,
    QMetaType::Void, QMetaType::Bool,   68,
    QMetaType::Void, QMetaType::QString,    2,
    QMetaType::Void, QMetaType::QString,    2,
    QMetaType::Void, 0x80000000 | 56,    2,
    QMetaType::Void, 0x80000000 | 38,    2,
    QMetaType::Void, 0x80000000 | 56,    2,
    QMetaType::Void, 0x80000000 | 38,    2,
    QMetaType::Void, 0x80000000 | 76,   75,
    QMetaType::Void, 0x80000000 | 78,   75,
    QMetaType::Void, 0x80000000 | 60,   80,
    QMetaType::Void, 0x80000000 | 60,   82,
    QMetaType::Void, 0x80000000 | 60,   84,
    QMetaType::Void, 0x80000000 | 60,   86,
    QMetaType::Void, 0x80000000 | 60,   88,
    QMetaType::Void, 0x80000000 | 60,   90,
    QMetaType::Void, 0x80000000 | 60,   92,
    QMetaType::Void, 0x80000000 | 60,   94,
    QMetaType::Void, QMetaType::QString, QMetaType::Int,   96,   57,
    QMetaType::Void,
    QMetaType::Void, 0x80000000 | 60, 0x80000000 | 62, 0x80000000 | 56,   99,    2,    2,
    QMetaType::Void, 0x80000000 | 60, 0x80000000 | 62, 0x80000000 | 56,  101,    2,   64,
    QMetaType::Void, 0x80000000 | 60, 0x80000000 | 62, 0x80000000 | 56,    2,    2,    2,
    QMetaType::Void, 0x80000000 | 38,  104,
    QMetaType::Void,
    QMetaType::Void,
    QMetaType::Void, QMetaType::Bool,  108,

       0        // eod
};

void Player::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        auto *_t = static_cast<Player *>(_o);
        (void)_t;
        switch (_id) {
        case 0: _t->newPlayer(); break;
        case 1: _t->buffLoad((*reinterpret_cast< const spellBuff*(*)>(_a[1]))); break;
        case 2: _t->newSpeed((*reinterpret_cast< double(*)>(_a[1]))); break;
        case 3: _t->statChanged((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2])),(*reinterpret_cast< int(*)>(_a[3]))); break;
        case 4: _t->addSkill((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 5: _t->changeSkill((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 6: _t->deleteSkills(); break;
        case 7: _t->addLanguage((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 8: _t->changeLanguage((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 9: _t->deleteLanguages(); break;
        case 10: _t->setExp((*reinterpret_cast< uint32_t(*)>(_a[1])),(*reinterpret_cast< uint32_t(*)>(_a[2])),(*reinterpret_cast< uint32_t(*)>(_a[3])),(*reinterpret_cast< uint32_t(*)>(_a[4])),(*reinterpret_cast< uint32_t(*)>(_a[5]))); break;
        case 11: _t->newExp((*reinterpret_cast< uint32_t(*)>(_a[1])),(*reinterpret_cast< uint32_t(*)>(_a[2])),(*reinterpret_cast< uint32_t(*)>(_a[3])),(*reinterpret_cast< uint32_t(*)>(_a[4])),(*reinterpret_cast< uint32_t(*)>(_a[5])),(*reinterpret_cast< uint32_t(*)>(_a[6]))); break;
        case 12: _t->setAltExp((*reinterpret_cast< uint32_t(*)>(_a[1])),(*reinterpret_cast< uint32_t(*)>(_a[2])),(*reinterpret_cast< uint32_t(*)>(_a[3])),(*reinterpret_cast< uint32_t(*)>(_a[4]))); break;
        case 13: _t->newAltExp((*reinterpret_cast< uint32_t(*)>(_a[1])),(*reinterpret_cast< uint32_t(*)>(_a[2])),(*reinterpret_cast< uint32_t(*)>(_a[3])),(*reinterpret_cast< uint32_t(*)>(_a[4])),(*reinterpret_cast< uint32_t(*)>(_a[5])),(*reinterpret_cast< uint32_t(*)>(_a[6]))); break;
        case 14: _t->expAltChangedInt((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2])),(*reinterpret_cast< int(*)>(_a[3]))); break;
        case 15: _t->expChangedInt((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2])),(*reinterpret_cast< int(*)>(_a[3]))); break;
        case 16: _t->expGained((*reinterpret_cast< const QString(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2])),(*reinterpret_cast< long(*)>(_a[3])),(*reinterpret_cast< QString(*)>(_a[4]))); break;
        case 17: _t->manaChanged((*reinterpret_cast< uint32_t(*)>(_a[1])),(*reinterpret_cast< uint32_t(*)>(_a[2]))); break;
        case 18: _t->stamChanged((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2])),(*reinterpret_cast< int(*)>(_a[3])),(*reinterpret_cast< int(*)>(_a[4]))); break;
        case 19: _t->hpChanged((*reinterpret_cast< int16_t(*)>(_a[1])),(*reinterpret_cast< int16_t(*)>(_a[2]))); break;
        case 20: _t->changedID((*reinterpret_cast< uint16_t(*)>(_a[1])),(*reinterpret_cast< uint16_t(*)>(_a[2]))); break;
        case 21: _t->posChanged((*reinterpret_cast< int16_t(*)>(_a[1])),(*reinterpret_cast< int16_t(*)>(_a[2])),(*reinterpret_cast< int16_t(*)>(_a[3])),(*reinterpret_cast< int16_t(*)>(_a[4])),(*reinterpret_cast< int16_t(*)>(_a[5])),(*reinterpret_cast< int16_t(*)>(_a[6])),(*reinterpret_cast< int32_t(*)>(_a[7]))); break;
        case 22: _t->changeItem((*reinterpret_cast< const Item*(*)>(_a[1])),(*reinterpret_cast< uint32_t(*)>(_a[2]))); break;
        case 23: _t->headingChanged((*reinterpret_cast< int32_t(*)>(_a[1]))); break;
        case 24: _t->levelChanged((*reinterpret_cast< uint8_t(*)>(_a[1]))); break;
        case 25: _t->guildChanged(); break;
        case 26: _t->playerUpdate((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 27: _t->clear(); break;
        case 28: _t->reset(); break;
        case 29: _t->setUseAutoDetectedSettings((*reinterpret_cast< bool(*)>(_a[1]))); break;
        case 30: _t->setDefaultName((*reinterpret_cast< const QString(*)>(_a[1]))); break;
        case 31: _t->setDefaultLastname((*reinterpret_cast< const QString(*)>(_a[1]))); break;
        case 32: _t->setDefaultLevel((*reinterpret_cast< uint8_t(*)>(_a[1]))); break;
        case 33: _t->setDefaultRace((*reinterpret_cast< uint16_t(*)>(_a[1]))); break;
        case 34: _t->setDefaultClass((*reinterpret_cast< uint8_t(*)>(_a[1]))); break;
        case 35: _t->setDefaultDeity((*reinterpret_cast< uint16_t(*)>(_a[1]))); break;
        case 36: _t->player((*reinterpret_cast< const charProfileStruct*(*)>(_a[1]))); break;
        case 37: _t->loadProfile((*reinterpret_cast< const playerProfileStruct(*)>(_a[1]))); break;
        case 38: _t->increaseSkill((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 39: _t->manaChange((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 40: _t->updateExp((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 41: _t->updateAltExp((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 42: _t->updateLevel((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 43: _t->updateNpcHP((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 44: _t->updateSpawnInfo((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 45: _t->updateStamina((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 46: _t->setLastKill((*reinterpret_cast< const QString(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 47: _t->zoneChanged(); break;
        case 48: _t->playerUpdateSelf((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 49: _t->consMessage((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 50: _t->tradeSpellBookSlots((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 51: _t->setPlayerID((*reinterpret_cast< uint16_t(*)>(_a[1]))); break;
        case 52: _t->savePlayerState(); break;
        case 53: _t->restorePlayerState(); break;
        case 54: _t->setUseDefaults((*reinterpret_cast< bool(*)>(_a[1]))); break;
        default: ;
        }
    } else if (_c == QMetaObject::IndexOfMethod) {
        int *result = reinterpret_cast<int *>(_a[0]);
        {
            using _t = void (Player::*)();
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&Player::newPlayer)) {
                *result = 0;
                return;
            }
        }
        {
            using _t = void (Player::*)(const spellBuff * );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&Player::buffLoad)) {
                *result = 1;
                return;
            }
        }
        {
            using _t = void (Player::*)(double );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&Player::newSpeed)) {
                *result = 2;
                return;
            }
        }
        {
            using _t = void (Player::*)(int , int , int );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&Player::statChanged)) {
                *result = 3;
                return;
            }
        }
        {
            using _t = void (Player::*)(int , int );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&Player::addSkill)) {
                *result = 4;
                return;
            }
        }
        {
            using _t = void (Player::*)(int , int );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&Player::changeSkill)) {
                *result = 5;
                return;
            }
        }
        {
            using _t = void (Player::*)();
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&Player::deleteSkills)) {
                *result = 6;
                return;
            }
        }
        {
            using _t = void (Player::*)(int , int );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&Player::addLanguage)) {
                *result = 7;
                return;
            }
        }
        {
            using _t = void (Player::*)(int , int );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&Player::changeLanguage)) {
                *result = 8;
                return;
            }
        }
        {
            using _t = void (Player::*)();
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&Player::deleteLanguages)) {
                *result = 9;
                return;
            }
        }
        {
            using _t = void (Player::*)(uint32_t , uint32_t , uint32_t , uint32_t , uint32_t );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&Player::setExp)) {
                *result = 10;
                return;
            }
        }
        {
            using _t = void (Player::*)(uint32_t , uint32_t , uint32_t , uint32_t , uint32_t , uint32_t );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&Player::newExp)) {
                *result = 11;
                return;
            }
        }
        {
            using _t = void (Player::*)(uint32_t , uint32_t , uint32_t , uint32_t );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&Player::setAltExp)) {
                *result = 12;
                return;
            }
        }
        {
            using _t = void (Player::*)(uint32_t , uint32_t , uint32_t , uint32_t , uint32_t , uint32_t );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&Player::newAltExp)) {
                *result = 13;
                return;
            }
        }
        {
            using _t = void (Player::*)(int , int , int );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&Player::expAltChangedInt)) {
                *result = 14;
                return;
            }
        }
        {
            using _t = void (Player::*)(int , int , int );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&Player::expChangedInt)) {
                *result = 15;
                return;
            }
        }
        {
            using _t = void (Player::*)(const QString & , int , long , QString );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&Player::expGained)) {
                *result = 16;
                return;
            }
        }
        {
            using _t = void (Player::*)(uint32_t , uint32_t );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&Player::manaChanged)) {
                *result = 17;
                return;
            }
        }
        {
            using _t = void (Player::*)(int , int , int , int );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&Player::stamChanged)) {
                *result = 18;
                return;
            }
        }
        {
            using _t = void (Player::*)(int16_t , int16_t );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&Player::hpChanged)) {
                *result = 19;
                return;
            }
        }
        {
            using _t = void (Player::*)(uint16_t , uint16_t );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&Player::changedID)) {
                *result = 20;
                return;
            }
        }
        {
            using _t = void (Player::*)(int16_t , int16_t , int16_t , int16_t , int16_t , int16_t , int32_t );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&Player::posChanged)) {
                *result = 21;
                return;
            }
        }
        {
            using _t = void (Player::*)(const Item * , uint32_t );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&Player::changeItem)) {
                *result = 22;
                return;
            }
        }
        {
            using _t = void (Player::*)(int32_t );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&Player::headingChanged)) {
                *result = 23;
                return;
            }
        }
        {
            using _t = void (Player::*)(uint8_t );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&Player::levelChanged)) {
                *result = 24;
                return;
            }
        }
        {
            using _t = void (Player::*)();
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&Player::guildChanged)) {
                *result = 25;
                return;
            }
        }
        {
            using _t = void (Player::*)(const uint8_t * , size_t , uint8_t );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&Player::playerUpdate)) {
                *result = 26;
                return;
            }
        }
    }
}

QT_INIT_METAOBJECT const QMetaObject Player::staticMetaObject = { {
    QMetaObject::SuperData::link<QObject::staticMetaObject>(),
    qt_meta_stringdata_Player.data,
    qt_meta_data_Player,
    qt_static_metacall,
    nullptr,
    nullptr
} };


const QMetaObject *Player::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *Player::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_meta_stringdata_Player.stringdata0))
        return static_cast<void*>(this);
    if (!strcmp(_clname, "Spawn"))
        return static_cast< Spawn*>(this);
    return QObject::qt_metacast(_clname);
}

int Player::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QObject::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 55)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 55;
    } else if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 55)
            *reinterpret_cast<int*>(_a[0]) = -1;
        _id -= 55;
    }
    return _id;
}

// SIGNAL 0
void Player::newPlayer()
{
    QMetaObject::activate(this, &staticMetaObject, 0, nullptr);
}

// SIGNAL 1
void Player::buffLoad(const spellBuff * _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 1, _a);
}

// SIGNAL 2
void Player::newSpeed(double _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 2, _a);
}

// SIGNAL 3
void Player::statChanged(int _t1, int _t2, int _t3)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t3))) };
    QMetaObject::activate(this, &staticMetaObject, 3, _a);
}

// SIGNAL 4
void Player::addSkill(int _t1, int _t2)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))) };
    QMetaObject::activate(this, &staticMetaObject, 4, _a);
}

// SIGNAL 5
void Player::changeSkill(int _t1, int _t2)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))) };
    QMetaObject::activate(this, &staticMetaObject, 5, _a);
}

// SIGNAL 6
void Player::deleteSkills()
{
    QMetaObject::activate(this, &staticMetaObject, 6, nullptr);
}

// SIGNAL 7
void Player::addLanguage(int _t1, int _t2)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))) };
    QMetaObject::activate(this, &staticMetaObject, 7, _a);
}

// SIGNAL 8
void Player::changeLanguage(int _t1, int _t2)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))) };
    QMetaObject::activate(this, &staticMetaObject, 8, _a);
}

// SIGNAL 9
void Player::deleteLanguages()
{
    QMetaObject::activate(this, &staticMetaObject, 9, nullptr);
}

// SIGNAL 10
void Player::setExp(uint32_t _t1, uint32_t _t2, uint32_t _t3, uint32_t _t4, uint32_t _t5)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t3))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t4))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t5))) };
    QMetaObject::activate(this, &staticMetaObject, 10, _a);
}

// SIGNAL 11
void Player::newExp(uint32_t _t1, uint32_t _t2, uint32_t _t3, uint32_t _t4, uint32_t _t5, uint32_t _t6)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t3))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t4))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t5))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t6))) };
    QMetaObject::activate(this, &staticMetaObject, 11, _a);
}

// SIGNAL 12
void Player::setAltExp(uint32_t _t1, uint32_t _t2, uint32_t _t3, uint32_t _t4)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t3))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t4))) };
    QMetaObject::activate(this, &staticMetaObject, 12, _a);
}

// SIGNAL 13
void Player::newAltExp(uint32_t _t1, uint32_t _t2, uint32_t _t3, uint32_t _t4, uint32_t _t5, uint32_t _t6)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t3))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t4))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t5))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t6))) };
    QMetaObject::activate(this, &staticMetaObject, 13, _a);
}

// SIGNAL 14
void Player::expAltChangedInt(int _t1, int _t2, int _t3)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t3))) };
    QMetaObject::activate(this, &staticMetaObject, 14, _a);
}

// SIGNAL 15
void Player::expChangedInt(int _t1, int _t2, int _t3)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t3))) };
    QMetaObject::activate(this, &staticMetaObject, 15, _a);
}

// SIGNAL 16
void Player::expGained(const QString & _t1, int _t2, long _t3, QString _t4)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t3))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t4))) };
    QMetaObject::activate(this, &staticMetaObject, 16, _a);
}

// SIGNAL 17
void Player::manaChanged(uint32_t _t1, uint32_t _t2)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))) };
    QMetaObject::activate(this, &staticMetaObject, 17, _a);
}

// SIGNAL 18
void Player::stamChanged(int _t1, int _t2, int _t3, int _t4)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t3))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t4))) };
    QMetaObject::activate(this, &staticMetaObject, 18, _a);
}

// SIGNAL 19
void Player::hpChanged(int16_t _t1, int16_t _t2)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))) };
    QMetaObject::activate(this, &staticMetaObject, 19, _a);
}

// SIGNAL 20
void Player::changedID(uint16_t _t1, uint16_t _t2)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))) };
    QMetaObject::activate(this, &staticMetaObject, 20, _a);
}

// SIGNAL 21
void Player::posChanged(int16_t _t1, int16_t _t2, int16_t _t3, int16_t _t4, int16_t _t5, int16_t _t6, int32_t _t7)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t3))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t4))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t5))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t6))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t7))) };
    QMetaObject::activate(this, &staticMetaObject, 21, _a);
}

// SIGNAL 22
void Player::changeItem(const Item * _t1, uint32_t _t2)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))) };
    QMetaObject::activate(this, &staticMetaObject, 22, _a);
}

// SIGNAL 23
void Player::headingChanged(int32_t _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 23, _a);
}

// SIGNAL 24
void Player::levelChanged(uint8_t _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 24, _a);
}

// SIGNAL 25
void Player::guildChanged()
{
    QMetaObject::activate(this, &staticMetaObject, 25, nullptr);
}

// SIGNAL 26
void Player::playerUpdate(const uint8_t * _t1, size_t _t2, uint8_t _t3)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t3))) };
    QMetaObject::activate(this, &staticMetaObject, 26, _a);
}
QT_WARNING_POP
QT_END_MOC_NAMESPACE
